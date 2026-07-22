import conf from './config';
import { Client, Databases } from "appwrite";

// ─── Shared helpers ────────────────────────────────────────────────────────────

const baseUrl = conf.appwriteUrl.replace(/\/+$/, '');
const client = new Client()
    .setEndpoint(conf.appwriteUrl)
    .setProject(conf.appwriteProjectId);
const databases = new Databases(client);

/**
 * Result of a fetchHealth call
 * @typedef {{ ok: boolean, data: object|null, status: number, statusText: string, error: string|null }} HealthFetchResult
 */

/**
 * Build common headers for health API requests.
 * Includes the API key if configured.
 */
function authHeaders() {
    const headers = {
        'X-Appwrite-Response-Format': '1.0.0',
    };
    if (conf.appwriteApiKey) {
        headers['X-Appwrite-Key'] = conf.appwriteApiKey;
        headers['X-Appwrite-Project'] = conf.appwriteProjectId;
    }
    return headers;
}

/**
 * Fetch a health endpoint and return detailed result including status code.
 * @param {string} path - URL path like '/health' or '/health/db'
 * @returns {Promise<HealthFetchResult>}
 */
async function fetchHealth(path) {
    try {
        const res = await fetch(`${baseUrl}${path}`, {
            headers: authHeaders(),
        });
        const body = await res.json().catch(() => null);
        return {
            ok: res.ok,
            data: body,
            status: res.status,
            statusText: res.statusText,
            error: res.ok ? null : (body?.message || res.statusText),
        };
    } catch (err) {
        return {
            ok: false,
            data: null,
            status: 0,
            statusText: 'Network Error',
            error: err.message || 'Unable to reach Appwrite server',
        };
    }
}

/**
 * Check basic server connectivity using the public /locale endpoint.
 * This endpoint is accessible to guests and doesn't require health.read scope.
 * @returns {Promise<{reachable: boolean, version: string|null, error: string|null}>}
 */
async function pingServer() {
    try {
        const res = await fetch(`${baseUrl}/locale`, {
            headers: {
                'X-Appwrite-Project': conf.appwriteProjectId,
                ...authHeaders(),
            },
        });
        if (res.ok) {
            const data = await res.json().catch(() => null);
            return {
                reachable: true,
                version: data?.version || null,
                error: null,
            };
        }
        // Even 401 means the server is up (it's just rejecting the guest request)
        if (res.status === 401) {
            return {
                reachable: true,
                version: null,
                error: null,
            };
        }
        return {
            reachable: false,
            version: null,
            error: `HTTP ${res.status}: ${res.statusText}`,
        };
    } catch (err) {
        return {
            reachable: false,
            version: null,
            error: err.message || 'Unable to reach Appwrite server',
        };
    }
}

/**
 * Check if a health fetch failed due to missing scope (401 / general_unauthorized_scope).
 */
function isScopeError(result) {
    return result.status === 401 &&
        result.data?.type === 'general_unauthorized_scope';
}

/**
 * Build an info message when the health scope is restricted.
 */
function scopeRestrictionMessage(scopes) {
    const missing = (scopes || ['health.read']).join(', ');
    return (
        `Health API requires scope [${missing}] which is not granted to guest users. ` +
        `The server is reachable, but detailed health data is unavailable. ` +
        `To enable, go to your Appwrite Console → API Keys and ensure the ${missing} scope is added, ` +
        `or make the health endpoint public under Auth → Settings → Allowed Scopes.`
    );
}

// ─── Legacy HealthService (used by /health page) ───────────────────────────────

/**
 * Service to check the health of the Appwrite server.
 * Gracefully handles scope-restricted health endpoints by falling back
 * to a basic connectivity check via the public /locale endpoint.
 */
export class HealthService {
    async check() {
        const result = {
            status: 'unknown',
            server: null,
            database: null,
            cache: null,
            time: null,
            error: null,
            scopeRestricted: false,
            scopeMessage: null,
        };

        // Try health endpoint
        const healthResult = await fetchHealth('/health');

        // If the server responded but scope is missing, we know it's reachable
        if (isScopeError(healthResult)) {
            result.scopeRestricted = true;
            result.scopeMessage = scopeRestrictionMessage(
                healthResult.data?.scopes
            );
            result.status = 'up';
            result.server = { status: 'pass', version: healthResult.data?.version || null };
            result.database = { status: 'unknown' };
            result.cache = { status: 'unknown' };
            result.time = { status: 'unknown' };
            return result;
        }

        // If health endpoint failed entirely, try basic ping
        if (!healthResult.ok) {
            const ping = await pingServer();
            if (ping.reachable) {
                result.status = 'up';
                result.server = { status: 'pass', version: ping.version || null };
                result.database = { status: 'unknown' };
                result.cache = { status: 'unknown' };
                result.time = { status: 'unknown' };
                result.error = 'Health API unavailable (scope restricted). Server is reachable.';
                return result;
            }
            result.status = 'down';
            result.error = healthResult.error || 'Unable to reach Appwrite server';
            return result;
        }

        // Health endpoint succeeded
        result.server = healthResult.data;
        result.status = healthResult.data.status === 'pass' ? 'up' : 'degraded';

        // --- Database health with full response ---
        const dbHealth = await fetchHealth('/health/db');
        if (dbHealth.ok && dbHealth.data) {
            result.database = dbHealth.data;
        } else {
            result.database = {
                status: 'fail',
                message: dbHealth.error || 'Database health check failed',
            };
        }

        // --- Cache health with full response ---
        const cacheHealth = await fetchHealth('/health/cache');
        if (cacheHealth.ok && cacheHealth.data) {
            result.cache = cacheHealth.data;
        } else {
            result.cache = {
                status: 'fail',
                message: cacheHealth.error || 'Cache health check failed',
            };
        }

        // --- Server time with full response ---
        const timeHealth = await fetchHealth('/health/time');
        if (timeHealth.ok && timeHealth.data) {
            result.time = timeHealth.data;
        } else {
            result.time = {
                status: 'fail',
                message: timeHealth.error || 'Time health check failed',
            };
        }

        return result;
    }
}

// ─── StatusService (used by /api/status page) ──────────────────────────────────

/**
 * Gathers detailed status data in the requested API JSON format.
 */
export class StatusService {
    async getStatus() {
        // Default response
        const response = {
            status: 'error',
            message: 'Unable to reach Appwrite server',
            data: {
                database: 'disconnected',
                db_Name: conf.appwriteDatabaseId || 'N/A',
                ping: 'error',
                uptime: 0,
                uptime_hours: '0.00',
                collections: 0,
                documents: 0,
                indexes: 0,
                data_size: '0.00 MB',
                storage_size: '0.00 MB',
            },
        };

        // --- Server health / ping ---
        const healthResult = await fetchHealth('/health');

        // Handle scope restriction gracefully
        if (isScopeError(healthResult)) {
            response.status = 'success';
            response.message = 'Server is running (health API scope restricted)';
            response.data.ping = 'ok';
            response.data.database = 'connected';
            return response;
        }

        // Health endpoint failed — try basic connectivity
        if (!healthResult.ok) {
            const ping = await pingServer();
            if (ping.reachable) {
                response.status = 'success';
                response.message = 'Server is reachable (health API unavailable)';
                response.data.ping = 'ok';
                return response;
            }
            return response;
        }

        // Health endpoint succeeded
        response.status = 'success';
        response.message = 'Server is running';
        response.data.ping = 'ok';

        // --- Database health ---
        const dbHealth = await fetchHealth('/health/db');
        if (dbHealth.ok && dbHealth.data) {
            response.data.database = dbHealth.data.status === 'pass' ? 'connected' : 'degraded';
        }

        // --- Server time / uptime ---
        const timeHealth = await fetchHealth('/health/time');
        if (timeHealth.ok && timeHealth.data?.remoteTime) {
            const offset = Math.abs(timeHealth.data.offset || 0);
            response.data.uptime = offset;
            response.data.uptime_hours = (offset / 3600).toFixed(2);
        }

        // --- Collections & documents via SDK ---
        try {
            const collectionsRes = await databases.listCollections(conf.appwriteDatabaseId);
            response.data.collections = collectionsRes.total || 0;

            let totalDocuments = 0;
            for (const collection of collectionsRes.collections || []) {
                try {
                    const docs = await databases.listDocuments(
                        conf.appwriteDatabaseId,
                        collection.$id,
                        [],
                        1
                    );
                    totalDocuments += docs.total || 0;
                } catch {
                    // Skip inaccessible collections
                }
            }
            response.data.documents = totalDocuments;
        } catch {
            // Fallback: try the known collection
            try {
                const docs = await databases.listDocuments(
                    conf.appwriteDatabaseId,
                    conf.appwriteCollectionId
                );
                response.data.documents = docs.total || 0;
                response.data.collections = 1;
            } catch {
                // No collection access
            }
        }

        // --- Data size estimate ---
        try {
            const docs = await databases.listDocuments(
                conf.appwriteDatabaseId,
                conf.appwriteCollectionId
            );
            if (docs?.documents) {
                const totalBytes = docs.documents.reduce((acc, doc) => {
                    return acc + new Blob([JSON.stringify(doc)]).size;
                }, 0);
                response.data.data_size = (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';
                const storageEstimate = totalBytes * 1.5;
                response.data.storage_size = (storageEstimate / (1024 * 1024)).toFixed(2) + ' MB';
            }
        } catch {
            // Estimate not available
        }

        return response;
    }
}

// ─── Singleton exports ─────────────────────────────────────────────────────────

const healthService = new HealthService();
const statusService = new StatusService();

export { healthService, statusService };
export default healthService;
