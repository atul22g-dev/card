# 🚀 Deploy to Vercel

This guide covers deploying the **Card** app — a React frontend with an Express backend + Appwrite — to Vercel.

## Table of Contents

- [Prerequisites](#prerequisites)
- [Option 1: Deploy Frontend Only (Static Site)](#option-1-deploy-frontend-only-static-site)
- [Option 2: Deploy Full Stack (Frontend + Express API)](#option-2-deploy-full-stack-frontend--express-api)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## Prerequisites

- A [Vercel](https://vercel.com) account (free tier works)
- Your project pushed to a Git provider (GitHub, GitLab, or Bitbucket)
- An Appwrite instance (cloud or self-hosted) already running

---

## Option 1: Deploy Frontend Only (Static Site)

This is the **simplest approach** — deploy just the React build. The Express API endpoints (`/api/status`, `/api/ping`) will **not** be available, but the core app (auth, cards, Appwrite integration) works because it connects directly to Appwrite from the browser.

### Steps

1. **Push your code to a Git repository** (e.g. GitHub)

2. **Import the project in Vercel**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Select your Git provider and repository
   - Vercel auto-detects Create React App

3. **Configure the project**

   | Setting | Value |
   |---------|-------|
   | **Framework Preset** | Create React App |
   | **Build Command** | `npm run build` |
   | **Output Directory** | `build` |
   | **Install Command** | `npm install` |

4. **Add environment variables**

   In the Vercel dashboard → **Settings** → **Environment Variables**, add:

   | Variable | Value |
   |----------|-------|
   | `REACT_APP_APPWRITE_URL` | Your Appwrite server URL (e.g. `https://cloud.appwrite.io/v1` or your self-hosted URL) |
   | `REACT_APP_APPWRITE_PROJECT_ID` | Your Appwrite project ID |
   | `REACT_APP_APPWRITE_DATABASE_ID` | Your Appwrite database ID |
   | `REACT_APP_APPWRITE_COLLECTION_ID` | Your Appwrite collection ID |
   | `REACT_APP_APPWRITE_BUCKET_ID` | Your Appwrite bucket ID |
   | `REACT_APP_APPWRITE_API_KEY` | (_Optional_) Your Appwrite API key |
   | `REACT_APP_SITE_URL` | Your Vercel deployment URL (e.g. `https://your-app.vercel.app`) |

5. **Deploy!**
   - Click **Deploy**
   - Vercel will build and publish your site

6. **(Optional) Set a custom domain**
   - Go to your project dashboard → **Domains**
   - Add your custom domain

---

## Option 2: Deploy Full Stack (Frontend + Express API)

If you need the Express API endpoints (`/api/status`, `/api/ping`) to work on Vercel, you need to configure Vercel to run the Express server as a **Serverless Function**.

> ✅ The required files (`vercel.json` and `api/index.js`) have already been created for you.

### Steps

1. **Push & Deploy**

   ```bash
   git add .
   git commit -m "Add Vercel full-stack deployment config"
   git push
   ```

2. **In Vercel Dashboard**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your repository
   - Add **all** environment variables from the table below
   - Click **Deploy**

3. **(Optional) Test locally with Vercel CLI**

   ```bash
   npm i -g vercel
   vercel dev
   ```

### How it works

- `vercel.json` — Tells Vercel to:
  - Route all `/api/*` requests to the serverless function
  - Serve `index.html` for all other routes (SPA fallback — required for client-side routing)
- `api/index.js` — Express app exported as a Vercel serverless function (no `app.listen()`, no static file serving — Vercel handles both)

> ⚠️ **Important:** The catch-all rewrite `{ "source": "/(.*)", "destination": "/index.html" }` is **required** for SPAs. Without it, refreshing on `/dashboard` or any deep link will return a 404.

---

## Environment Variables

| Variable | Required | Description |
|----------|----------|-------------|
| `REACT_APP_APPWRITE_URL` | ✅ Yes | Appwrite server endpoint (e.g. `https://cloud.appwrite.io/v1`) |
| `REACT_APP_APPWRITE_PROJECT_ID` | ✅ Yes | Appwrite project ID |
| `REACT_APP_APPWRITE_DATABASE_ID` | ✅ Yes | Appwrite database ID |
| `REACT_APP_APPWRITE_COLLECTION_ID` | ✅ Yes | Appwrite collection ID |
| `REACT_APP_APPWRITE_BUCKET_ID` | ✅ Yes | Appwrite bucket ID (for file uploads) |
| `REACT_APP_APPWRITE_API_KEY` | ❌ No | Appwrite API key (needed for server-side health check) |
| `REACT_APP_SITE_URL` | ❌ No | Your site URL (defaults to `window.location.origin`) |

> **Important:** Variables prefixed with `REACT_APP_` are **public** (visible in the browser). Never put sensitive secrets here unless they're meant to be public.

---

## Troubleshooting

### ❌ Blank page after deployment

- Check the **Build Logs** in Vercel for errors
- Make sure `REACT_APP_*` variables are set in the Vercel dashboard
- Verify the `homepage` field in `package.json` (if present) matches your deployment URL. Remove it if you're deploying to a subpath.

### ❌ API routes return 404

- If you're using **Option 2**, ensure `vercel.json` is in the project root
- Make sure `api/index.js` exists and exports the Express app via `module.exports`

### ❌ Appwrite connection issues

- Verify your Appwrite instance is accessible from the internet
- Check CORS settings in Appwrite Console → **Auth** → **Settings** → add your Vercel domain
- Confirm all environment variables are correct

### ❌ "Failed to load resource: net::ERR_NAME_NOT_RESOLVED"

- Your Appwrite URL is likely pointing to a localhost/private address
- Use a public Appwrite Cloud URL or ensure your self-hosted instance is publicly accessible

### ❌ OAuth2 redirect issues

- In Appwrite Console → **Auth** → **Settings**, add your Vercel domain (e.g. `https://your-app.vercel.app`) to the list of **Allowed Callback URLs**
- Make sure `REACT_APP_SITE_URL` is set to your Vercel domain

---

## Quick Checklist

- [ ] Project pushed to GitHub/GitLab/Bitbucket
- [ ] Vercel account created
- [ ] Appwrite instance is running and publicly accessible
- [ ] CORS origins configured in Appwrite Console
- [ ] Environment variables added in Vercel dashboard
- [ ] For full-stack: `vercel.json` and `api/index.js` created
- [ ] Deployed successfully
- [ ] Tested auth, card creation, and data display on the live site
