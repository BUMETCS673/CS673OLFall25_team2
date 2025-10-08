# API Proxy Service

Purpose: Provide an HTTPS endpoint for the frontend so it can call the existing HTTP-only backend without browser Mixed Content errors. This does **not** modify backend code.

## How It Works

The proxy runs on Render (or locally) and forwards any request starting with `/api` to the configured `TARGET_BACKEND` host. Because the proxy is served over HTTPS, the browser is satisfied and the proxied hop from proxy -> backend happens server-to-server over HTTP.

```
Browser (HTTPS) -> Render Proxy (HTTPS) -> Backend (HTTP) -> Render Proxy -> Browser
```

## Files

- `server.mjs` – Express app with `http-proxy-middleware` forwarding `/api/*`.
- `package.json` – Minimal dependencies and start script.

## Deploy to Render

1. New Web Service → Connect repo → Root Directory: `code/api-proxy`.
2. Build Command: `npm ci` (Render auto-detects and then uses `start`).
3. Start Command: `npm start`.
4. Environment Variable:
   - `TARGET_BACKEND=http://54.227.173.227`
5. Deploy. Note the HTTPS URL e.g. `https://careerforge-proxy.onrender.com`.

## Frontend Update

Set (in Static Site service environment variables):

```
VITE_API_BASE_URL=https://<your-proxy-hostname>/api
```

Redeploy the static site so the new URL is baked in.

## Local Testing

```
cd code/api-proxy
npm ci
TARGET_BACKEND=http://54.227.173.227 npm start
```

Then in another terminal:

```
curl http://localhost:5179/health
curl http://localhost:5179/api/actuator/health
```

## Adjustments

- If backend context path changes, adapt the proxy mount or rewrite rules.
- Add authentication / rate limiting here if you later need control over traffic.

## Security Note

Do **not** put secrets into `VITE_` variables—they end up in the client bundle. The proxy can eventually enforce auth or add headers if needed, but for now it is a transparent pass-through.
