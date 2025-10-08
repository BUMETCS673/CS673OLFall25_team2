import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { createProxyMiddleware } from 'http-proxy-middleware';

// TARGET_BACKEND should include protocol + host (and optional :port) WITHOUT trailing slash.
// We assume the backend already serves with context-path /api (as in Spring Boot config: server.servlet.context-path=/api).
// Example: http://54.227.173.227
const targetBackend = process.env.TARGET_BACKEND || 'http://54.227.173.227';

// Port provided by hosting (Render sets PORT); fallback for local testing.
const port = process.env.PORT || 5179;

const app = express();
app.disable('x-powered-by');
app.use(morgan('tiny'));
app.use(cors({ origin: true, credentials: true }));

// Health endpoint for monitoring
app.get('/health', (req, res) => {
  res.json({ status: 'ok', targetBackend });
});

// Proxy /api/* directly to the backend (which itself has /api context path). We do NOT rewrite the path.
app.use(
  '/api',
  createProxyMiddleware({
    target: targetBackend,
    changeOrigin: true,
    // Preserve path; if backend context-path changes, adjust here.
    logLevel: 'warn',
    onProxyReq(proxyReq, req) {
      // Optionally add headers for tracing
      proxyReq.setHeader('x-forwarded-by', 'careerforge-proxy');
    },
  })
);

// Catch-all for clarity
app.use((req, res) => {
  res.status(404).json({ error: 'Not Found', path: req.path });
});

app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(
    `API proxy listening on :${port}, forwarding /api -> ${targetBackend}`
  );
});
