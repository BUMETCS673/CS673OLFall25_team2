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

// CORS configuration: explicitly allow local preview and the Render static site by default
const defaultAllowedOrigins = [
  'http://localhost:5173', // Vite dev
  'http://localhost:4173', // Vite preview
  'https://cs673olfall25-team2.onrender.com', // Render Static Site
  'http://cs673olfall25-team2.onrender.com', // HTTP version
  'https://cs673olfall25-team2-proxy.onrender.com', // Our proxy domain
];
const allowedOrigins = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  : defaultAllowedOrigins;

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (no Origin) and known allowed origins
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`CORS: origin not allowed: ${origin}`));
  },
  credentials: true,
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Requested-With',
    'Accept',
    'Origin',
    'Access-Control-Request-Method',
    'Access-Control-Request-Headers',
  ],
  maxAge: 86400, // cache preflight for a day
};

app.use(cors(corsOptions));
// Ensure preflight requests are handled by Express (not proxied)
app.options('/api/*', cors(corsOptions));

// Basic health endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', targetBackend, healthPath });
});

// Proxy configuration
const proxyOptions = {
  target: targetWithApi,
  changeOrigin: true,
  logLevel: proxyLogLevel,
  // Timeouts to avoid premature gateway errors on slower endpoints
  proxyTimeout: Number(process.env.PROXY_TIMEOUT_MS || 15000), // backend response timeout
  timeout: Number(process.env.CLIENT_SOCKET_TIMEOUT_MS || 15000), // client socket timeout
  // Ensure headers needed for CORS/credentials survive
  onProxyReq(proxyReq, req) {
    // Store the original headers we might need later
    const originalHeaders = { ...req.headers };

    // Clear all headers first
    Object.keys(proxyReq.getHeaders()).forEach((header) => {
      proxyReq.removeHeader(header);
    });

    // Set proxy identification
    proxyReq.setHeader('x-forwarded-by', 'careerforge-proxy');

    // Forward essential headers
    const headersToForward = {
      authorization: originalHeaders['authorization'],
      'content-type': originalHeaders['content-type'],
      accept: originalHeaders['accept'],
      origin: originalHeaders['origin'],
      referer: originalHeaders['referer'],
      'user-agent': originalHeaders['user-agent'],
      host: targetBackend.replace(/^https?:\/\//, ''),
      connection: 'keep-alive',
    };

    // Set each header if it exists
    Object.entries(headersToForward).forEach(([key, value]) => {
      if (value) {
        proxyReq.setHeader(key, value);
        console.debug(`[proxy:debug] Setting header ${key}:`, value);
      }
    });
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
  onProxyRes(proxyRes, req, res) {
    console.debug?.(
      '[proxy:res]',
      req.method,
      req.url,
      'status',
      proxyRes.statusCode,
      'headers:',
      proxyRes.headers
    );

    // Set CORS headers in response
    if (req.headers.origin && allowedOrigins.includes(req.headers.origin)) {
      try {
        res.setHeader('Access-Control-Allow-Origin', req.headers.origin);
        res.setHeader('Access-Control-Allow-Credentials', 'true');
        res.setHeader(
          'Access-Control-Allow-Methods',
          'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
        );
        res.setHeader(
          'Access-Control-Allow-Headers',
          'Content-Type,Authorization,X-Requested-With,Accept,Origin'
        );
        res.setHeader('Vary', 'Origin');
      } catch (e) {
        console.error('[proxy:error] Failed to set CORS headers:', e);
      }
    }
  },
  onError(err, req, res) {
    // eslint-disable-next-line no-console
    console.error('[proxy:error]', {
      message: err.message,
      code: err.code,
      stack: process.env.PROXY_LOG === 'debug' ? err.stack : undefined,
      method: req.method,
      url: req.url,
    });
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'application/json' });
    }
    res.end(
      JSON.stringify({
        error: 'Bad Gateway',
        detail: err.message,
        code: err.code,
      })
    );
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
