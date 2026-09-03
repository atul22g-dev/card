/**
 * Vercel serverless entry point.
 *
 * Shared logic lives in lib/appwrite-server.js — this file only wires up
 * CORS and exports the Express app Vercel will invoke.
 */
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { registerApiRoutes } = require('../lib/appwrite-server');

const app = express();

// CORS — allow all origins for the API endpoint
app.use('/api', cors());

// ─── API Routes ────────────────────────────────────────────────────────────────

registerApiRoutes(app);

// Export as a Vercel serverless function
module.exports = app;
