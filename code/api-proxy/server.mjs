import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

// =============================
// Configuration
// =============================
// TARGET_BACKEND: protocol + host (+ optional :port). Example: http://54.227.173.227
const targetBackend = process.env.TARGET_BACKEND || 'http://54.227.173.227';
// The backend mounts its API at /api, while Express strips the mount path (/api)
// from req.url before it reaches the proxy. To ensure the forwarded request
// goes to /api/... on the backend, set the proxy target to TARGET_BACKEND/api
// and keep the incoming trimmed path (e.g., /actuator/health).
const targetWithApi = `${targetBackend.replace(/\/$/, '')}/api`;
// HEALTH_PATH is used only for startup diagnostics (no traffic blocked if it fails)
const healthPath =
  process.env.TARGET_BACKEND_HEALTH_PATH || '/api/actuator/health';
// Proxy listening port (Render supplies PORT)
const port = process.env.PORT || 5179;
// Enable verbose proxy logging with PROXY_LOG=debug
const proxyLogLevel = process.env.PROXY_LOG || 'warn';

// =============================
// App bootstrap
// =============================
const app = express();
app.disable('x-powered-by');
app.use(morgan('tiny'));
app.use(cors({ origin: true, credentials: true }));

// Basic health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', targetBackend, healthPath });
});

// Proxy configuration
const proxyOptions = {
  target: targetWithApi,
  changeOrigin: true,
  logLevel: proxyLogLevel,
  onProxyReq(proxyReq, req) {
    proxyReq.setHeader('x-forwarded-by', 'careerforge-proxy');
    // eslint-disable-next-line no-console
    console.debug?.(
      '[proxy:req]',
      req.method,
      req.url,
      '->',
      proxyReq.getHeader('host'),
      proxyReq.path
    );
  },
  onProxyRes(proxyRes, req) {
    // eslint-disable-next-line no-console
    console.debug?.(
      '[proxy:res]',
      req.method,
      req.url,
      'status',
      proxyRes.statusCode
    );
  },
  onError(err, req, res) {
    // eslint-disable-next-line no-console
    console.error('[proxy:error]', err.message);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(JSON.stringify({ error: 'Bad Gateway', detail: err.message }));
  },
};

app.use('/api', createProxyMiddleware(proxyOptions));

// Fallback 404
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

// Startup diagnostics (non-blocking)
async function startupDiagnostics() {
  // Check multiple possible health endpoint paths
  const possiblePaths = [
    healthPath, // configured path (default: /actuator/health)
    '/actuator/health', // Spring Boot default
    '/api/actuator/health', // With /api prefix
    '/health', // Simple health endpoint
    '/api/health', // Simple with /api prefix
  ];

  // Track if any health endpoint was successful
  let anySuccessful = false;

  for (const path of possiblePaths) {
    const url = `${targetBackend}${path.startsWith('/') ? '' : '/'}${path}`;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 4000);
      const r = await fetch(url, { method: 'GET', signal: controller.signal });
      clearTimeout(timeout);
      const ok = r.ok;

      // eslint-disable-next-line no-console
      console.log(
        `[startup] Health probe ${url} -> ${r.status}${ok ? ' OK' : ''}`
      );

      if (ok) {
        anySuccessful = true;
        // If this isn't our configured path, suggest updating the configuration
        if (path !== healthPath) {
          console.log(
            `[startup] Consider setting TARGET_BACKEND_HEALTH_PATH=${path}`
          );
        }
      }
    } catch (e) {
      // eslint-disable-next-line no-console
      console.warn('[startup] Health probe failed:', url, e.message);
    }
  }

  if (!anySuccessful) {
    console.warn(
      '[startup] WARNING: Could not find a working health endpoint!'
    );
    console.warn(
      '[startup] The proxy will still function, but health checks may fail.'
    );
  }
}

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `API proxy listening on :${port} | forwarding /api/* -> ${targetWithApi}/*`
  );
  startupDiagnostics();
});
