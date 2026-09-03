/**
 * Local Node server (dev / prod mode).
 *
 * Shared logic lives in lib/appwrite-server.js — this file only wires up
 * CORS, static file serving, and the listen call.
 */
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

const { registerApiRoutes } = require('./lib/appwrite-server');

const app = express();

// CORS — restrict to known origins in production
const allowedOrigins = (process.env.ALLOWED_ORIGINS || '').split(',').filter(Boolean);
app.use('/api', cors({
    origin: allowedOrigins.length > 0 ? allowedOrigins : true,
    methods: ['GET'],
    maxAge: 86400,
}));

// ─── API Routes ────────────────────────────────────────────────────────────────

registerApiRoutes(app);

// ─── Static build (prod mode) ──────────────────────────────────────────────────

const buildDir = path.join(__dirname, 'build');
if (fs.existsSync(path.join(buildDir, 'index.html'))) {
    app.use(express.static(buildDir));
    // SPA fallback: let React Router handle non-API GET routes
    app.use((req, res, next) => {
        if (req.method !== 'GET' || req.path.startsWith('/api')) return next();
        res.sendFile(path.join(buildDir, 'index.html'));
    });
}

// ─── Start (local dev / prod) ──────────────────────────────────────────────────

const PORT = Number(process.env.PORT) || 4000;
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Freebuff server listening on http://localhost:${PORT}`);
    });
}

// Export so api/index.js-style harnesses and tests can reuse the app
module.exports = app;
