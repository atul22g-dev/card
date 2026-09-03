/**
 * Shared server-side Appwrite layer.
 *
 * Used by both server entry points so their logic never drifts apart:
 *   - server.js    → local Node server (dev / prod mode)
 *   - api/index.js → Vercel serverless function
 *
 * Every Appwrite setting is read from the environment once (see `config`)
 * and all REST helpers / report builders / routes live here.
 */
const { Client, Databases } = require('appwrite');

// ─── Config (single source of truth for the server) ───────────────────────────

const config = {
    url: String(process.env.REACT_APP_APPWRITE_URL || '').replace(/\/+$/, ''),
    projectId: process.env.REACT_APP_APPWRITE_PROJECT_ID || '',
    databaseId: process.env.REACT_APP_APPWRITE_DATABASE_ID || '',
    collectionId: process.env.REACT_APP_APPWRITE_COLLECTION_ID || '',
    apiKey: process.env.REACT_APP_APPWRITE_API_KEY || '',
};

// Session-less SDK client — used only for collection/document counts in getStatus().
const client = new Client()
    .setEndpoint(config.url)
    .setProject(config.projectId);
const databases = new Databases(client);

// ─── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders() {
    const headers = { 'X-Appwrite-Response-Format': '1.0.0' };
    if (config.apiKey) {
        headers['X-Appwrite-Key'] = config.apiKey;
        headers['X-Appwrite-Project'] = config.projectId;
    }
    return headers;
}

async function fetchHealth(path) {
    try {
        const res = await fetch(`${config.url}${path}`, { headers: authHeaders() });
        if (!res.ok) {
            return { ok: false, data: null, status: res.status };
        }
        const data = await res.json().catch(() => null);
        return { ok: true, data, status: res.status };
    } catch {
        return { ok: false, data: null, status: 0 };
    }
}

async function pingServer() {
    try {
        const res = await fetch(`${config.url}/locale`, {
            headers: {
                'X-Appwrite-Project': config.projectId,
                ...authHeaders(),
            },
        });
        return res.ok || res.status === 401;
    } catch {
        return false;
    }
}

function isScopeError(result) {
    return result.status === 401 && result.data?.type === 'general_unauthorized_scope';
}

/**
 * Appwrite 1.5+ health sub-checks (db/cache) return an aggregated
 * { total, statuses: [...] } object with NO top-level `status`, while older
 * versions return a plain { status }. Treat the check as passing only when
 * every reported sub-check passes.
 */
function isHealthPass(data) {
    if (!data) return false;
    if (typeof data.status === 'string') return data.status === 'pass';
    // Newer Appwrite returns /health/time as { remoteTime, localTime, diff } with no status
    if (data.remoteTime) return true;
    if (Array.isArray(data.statuses)) {
        return (
            data.statuses.length > 0 &&
            data.statuses.every((s) => {
                const st = typeof s === 'string' ? s : s && s.status;
                return st === 'pass';
            })
        );
    }
    return false;
}

function summarizeHealth(result, failMessage) {
    if (!result.ok || !result.data) {
        return {
            status: 'fail',
            message: isScopeError(result)
                ? 'Health scope not granted to the server API key'
                : (failMessage || 'Health check failed'),
        };
    }
    const pass = isHealthPass(result.data);
    return {
        status: pass ? 'pass' : 'fail',
        message: pass ? undefined : (result.data.message || result.data.description || failMessage),
    };
}

// ─── Shared shapes ─────────────────────────────────────────────────────────────

const EMPTY_STATUS_DATA = {
    database: 'disconnected',
    db_Name: 'N/A',
    ping: 'error',
    uptime: 0,
    uptime_hours: '0.00',
    collections: 0,
    documents: 0,
    indexes: 0,
    data_size: '0.00 MB',
    storage_size: '0.00 MB',
};

// ─── Report builders ───────────────────────────────────────────────────────────

/**
 * Gather status in the same format as the client-side StatusService.
 */
async function getStatus() {
    const response = {
        status: 'error',
        message: 'Unable to reach Appwrite server',
        data: { ...EMPTY_STATUS_DATA, db_Name: config.databaseId || 'N/A' },
    };

    const healthResult = await fetchHealth('/health');

    if (isScopeError(healthResult)) {
        response.status = 'success';
        response.message = 'Server is running (health API scope restricted)';
        response.data.ping = 'ok';
        response.data.database = 'connected';
        return response;
    }

    if (!healthResult.ok) {
        const reachable = await pingServer();
        if (reachable) {
            response.status = 'success';
            response.message = 'Server is reachable (health API unavailable)';
            response.data.ping = 'ok';
            return response;
        }
        return response;
    }

    response.status = 'success';
    response.message = 'Server is running';
    response.data.ping = 'ok';

    const dbHealth = await fetchHealth('/health/db');
    if (dbHealth.ok && dbHealth.data) {
        response.data.database = isHealthPass(dbHealth.data) ? 'connected' : 'degraded';
    }

    const timeHealth = await fetchHealth('/health/time');
    if (timeHealth.ok && timeHealth.data?.remoteTime) {
        const offset = Math.abs(timeHealth.data.offset || 0);
        response.data.uptime = offset;
        response.data.uptime_hours = (offset / 3600).toFixed(2);
    }

    // Collections & documents via SDK
    try {
        const collectionsRes = await databases.listCollections(config.databaseId);
        response.data.collections = collectionsRes.total || 0;
        const results = await Promise.allSettled(
            (collectionsRes.collections || []).map(collection =>
                databases.listDocuments(config.databaseId, collection.$id, [], 1)
            )
        );
        response.data.documents = results.reduce((sum, r) => sum + (r.status === 'fulfilled' ? (r.value.total || 0) : 0), 0);
    } catch {
        try {
            const docs = await databases.listDocuments(config.databaseId, config.collectionId);
            response.data.documents = docs.total || 0;
            response.data.collections = 1;
        } catch { /* no access */ }
    }

    // Data size estimate
    try {
        const docs = await databases.listDocuments(config.databaseId, config.collectionId);
        if (docs?.documents) {
            const totalBytes = docs.documents.reduce((acc, doc) => acc + Buffer.byteLength(JSON.stringify(doc)), 0);
            response.data.data_size = (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';
            response.data.storage_size = ((totalBytes * 1.5) / (1024 * 1024)).toFixed(2) + ' MB';
        }
    } catch { /* skip */ }

    return response;
}

/**
 * Server-side health report. Same shape the /health page expects from
 * HealthService.check(), but authenticated with the API key so real
 * database/cache/time data is available (not guest scope-restricted).
 */
async function getHealthReport() {
    const report = {
        status: 'down',
        server: null,
        database: { status: 'fail' },
        cache: { status: 'fail' },
        time: { status: 'fail' },
        error: 'Unable to reach Appwrite server',
        scopeRestricted: false,
        scopeMessage: null,
    };

    const health = await fetchHealth('/health');

    if (isScopeError(health)) {
        report.status = 'up';
        report.server = { status: 'pass' };
        report.error = null;
        report.scopeRestricted = true;
        report.scopeMessage = 'Health API requires scope [health.read] which is not granted to the server API key.';
        return report;
    }

    if (!health.ok) {
        const reachable = await pingServer();
        if (reachable) {
            report.status = 'up';
            report.server = { status: 'pass' };
            report.error = 'Health API unavailable (scope restricted). Server is reachable.';
        }
        return report;
    }

    report.status = health.data.status === 'pass' ? 'up' : 'degraded';
    report.server = {
        status: health.data.status === 'pass' ? 'pass' : 'fail',
        name: health.data.name,
        version: health.data.version,
    };
    report.error = null;

    report.database = summarizeHealth(await fetchHealth('/health/db'), 'Database health check failed');
    report.cache = summarizeHealth(await fetchHealth('/health/cache'), 'Cache health check failed');
    report.time = summarizeHealth(await fetchHealth('/health/time'), 'Time health check failed');

    return report;
}

// ─── Routes ────────────────────────────────────────────────────────────────────

/**
 * Mount every /api route on the given Express app.
 * CORS / static / listen behavior belongs to the entry points, not here.
 */
function registerApiRoutes(app) {
    // GET /api/status — detailed server + database status
    app.get('/api/status', async (_req, res) => {
        try {
            res.json(await getStatus());
        } catch (err) {
            res.status(500).json({
                status: 'error',
                message: err.message || 'Internal server error',
                data: { ...EMPTY_STATUS_DATA, db_Name: config.databaseId || 'N/A' },
            });
        }
    });

    // GET /api/health — health report for the /health page (key-authenticated)
    app.get('/api/health', async (_req, res) => {
        try {
            res.json(await getHealthReport());
        } catch (err) {
            res.status(500).json({
                status: 'down',
                server: null,
                database: { status: 'fail' },
                cache: { status: 'fail' },
                time: { status: 'fail' },
                error: err.message || 'Internal server error',
                scopeRestricted: false,
                scopeMessage: null,
            });
        }
    });

    // GET /api/ping — health check for the server itself
    app.get('/api/ping', (_req, res) => {
        res.json({ status: 'ok', timestamp: new Date().toISOString() });
    });
}

module.exports = {
    config,
    authHeaders,
    fetchHealth,
    pingServer,
    isScopeError,
    isHealthPass,
    summarizeHealth,
    getStatus,
    getHealthReport,
    registerApiRoutes,
};
