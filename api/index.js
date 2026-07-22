const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { Client, Databases } = require('appwrite');

// ─── Appwrite Config ───────────────────────────────────────────────────────────

const {
    REACT_APP_APPWRITE_URL,
    REACT_APP_APPWRITE_PROJECT_ID,
    REACT_APP_APPWRITE_DATABASE_ID,
    REACT_APP_APPWRITE_COLLECTION_ID,
    REACT_APP_APPWRITE_API_KEY,
} = process.env;

const baseUrl = (REACT_APP_APPWRITE_URL || '').replace(/\/+$/, '');
const client = new Client()
    .setEndpoint(REACT_APP_APPWRITE_URL || '')
    .setProject(REACT_APP_APPWRITE_PROJECT_ID || '');
const databases = new Databases(client);

// ─── Helpers ───────────────────────────────────────────────────────────────────

function authHeaders() {
    const headers = { 'X-Appwrite-Response-Format': '1.0.0' };
    if (REACT_APP_APPWRITE_API_KEY) {
        headers['X-Appwrite-Key'] = REACT_APP_APPWRITE_API_KEY;
        headers['X-Appwrite-Project'] = REACT_APP_APPWRITE_PROJECT_ID;
    }
    return headers;
}

async function fetchHealth(path) {
    try {
        const res = await fetch(`${baseUrl}${path}`, { headers: authHeaders() });
        const body = await res.json().catch(() => null);
        return { ok: res.ok, data: body, status: res.status };
    } catch {
        return { ok: false, data: null, status: 0 };
    }
}

async function pingServer() {
    try {
        const res = await fetch(`${baseUrl}/locale`, {
            headers: {
                'X-Appwrite-Project': REACT_APP_APPWRITE_PROJECT_ID,
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
 * Gather status in the same format as the client-side StatusService.
 */
async function getStatus() {
    const response = {
        status: 'error',
        message: 'Unable to reach Appwrite server',
        data: {
            database: 'disconnected',
            db_Name: REACT_APP_APPWRITE_DATABASE_ID || 'N/A',
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
        response.data.database = dbHealth.data.status === 'pass' ? 'connected' : 'degraded';
    }

    const timeHealth = await fetchHealth('/health/time');
    if (timeHealth.ok && timeHealth.data?.remoteTime) {
        const offset = Math.abs(timeHealth.data.offset || 0);
        response.data.uptime = offset;
        response.data.uptime_hours = (offset / 3600).toFixed(2);
    }

    // Collections & documents via SDK
    try {
        const collectionsRes = await databases.listCollections(REACT_APP_APPWRITE_DATABASE_ID);
        response.data.collections = collectionsRes.total || 0;
        let totalDocuments = 0;
        for (const collection of collectionsRes.collections || []) {
            try {
                const docs = await databases.listDocuments(REACT_APP_APPWRITE_DATABASE_ID, collection.$id, [], 1);
                totalDocuments += docs.total || 0;
            } catch { /* skip */ }
        }
        response.data.documents = totalDocuments;
    } catch {
        try {
            const docs = await databases.listDocuments(REACT_APP_APPWRITE_DATABASE_ID, REACT_APP_APPWRITE_COLLECTION_ID);
            response.data.documents = docs.total || 0;
            response.data.collections = 1;
        } catch { /* no access */ }
    }

    // Data size estimate
    try {
        const docs = await databases.listDocuments(REACT_APP_APPWRITE_DATABASE_ID, REACT_APP_APPWRITE_COLLECTION_ID);
        if (docs?.documents) {
            const totalBytes = docs.documents.reduce((acc, doc) => acc + Buffer.byteLength(JSON.stringify(doc)), 0);
            response.data.data_size = (totalBytes / (1024 * 1024)).toFixed(2) + ' MB';
            response.data.storage_size = ((totalBytes * 1.5) / (1024 * 1024)).toFixed(2) + ' MB';
        }
    } catch { /* skip */ }

    return response;
}

// ─── Express App ───────────────────────────────────────────────────────────────

const app = express();

// CORS — allow all origins for the API endpoint
app.use('/api', cors());

// ─── API Routes ────────────────────────────────────────────────────────────────

// GET /api/status — returns JSON with proper Content-Type and CORS headers
app.get('/api/status', async (_req, res) => {
    try {
        const data = await getStatus();
        res.json(data);
    } catch (err) {
        res.status(500).json({
            status: 'error',
            message: err.message || 'Internal server error',
            data: {
                database: 'disconnected',
                db_Name: REACT_APP_APPWRITE_DATABASE_ID || 'N/A',
                ping: 'error',
                uptime: 0,
                uptime_hours: '0.00',
                collections: 0,
                documents: 0,
                indexes: 0,
                data_size: '0.00 MB',
                storage_size: '0.00 MB',
            },
        });
    }
});

// Health check for the server itself
app.get('/api/ping', (_req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Export as a Vercel serverless function
module.exports = app;
