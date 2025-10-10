// src/api/http.ts
// Lightweight HTTP client wrapper with JSON and auth support
// Copilot generated with manual tweaks
// Human review and adjustments made for clarity and functionality
// 30% AI-generated, 70% human refined

// Get API base URL with proper validation and fallbacks
const getApiBaseUrl = (): string => {
  // Primary source: Environment variable
  const envApiBase = import.meta.env.VITE_API_BASE_URL;

  // Validate and sanitize the URL
  if (envApiBase && typeof envApiBase === 'string') {
    // Normalize URL (remove trailing slashes for consistency)
    const normalizedUrl = envApiBase.replace(/\/+$/, '');

    // Validate that it's a proper URL (or at least starts with http)
    if (
      normalizedUrl.startsWith('http://') ||
      normalizedUrl.startsWith('https://')
    ) {
      return normalizedUrl;
    } else {
      console.warn(
        `[API] Invalid API base URL format: ${normalizedUrl}. Using fallback.`
      );
    }
  }

  // Fallback to localhost for development
  const fallbackUrl = 'http://localhost:8080/api';
  console.warn(`[API] Using fallback URL: ${fallbackUrl}`);
  return fallbackUrl;
};

// Export the validated API base URL
export const API_BASE: string = getApiBaseUrl();

// Log current configuration (but hide in production)
if (import.meta.env.DEV) {
  console.log('[API] Base URL configured as:', API_BASE);
}

export type HttpOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
  noAuth?: boolean;
  noCsrf?: boolean;
};

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('jwt');
  } catch {
    return null;
  }
}

export function getCsrfToken(): string | null {
  try {
    return localStorage.getItem('csrfToken');
  } catch {
    return null;
  }
}

export function setCsrfToken(token: string | null): void {
  try {
    if (token) {
      localStorage.setItem('csrfToken', token);
    } else {
      localStorage.removeItem('csrfToken');
    }
  } catch {
    // Ignore storage errors
  }
}

export function buildHeaders(
  headers?: Record<string, string>,
  noAuth?: boolean,
  noCsrf?: boolean,
  method: string = 'GET'
): HeadersInit {
  const base: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };
  if (!noAuth) {
    const token = getAuthToken();
    if (token) base['Authorization'] = `Bearer ${token}`;
  }
  if (!noCsrf && method !== 'GET') {
    const csrfToken = getCsrfToken();
    if (csrfToken) base['X-XSRF-TOKEN'] = csrfToken;
  }
  return base;
}

export async function http<T = any>(
  path: string,
  { method = 'GET', headers, body, noAuth, noCsrf }: HttpOptions = {}
): Promise<{ data: T; response: Response }> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders(headers, noAuth, noCsrf, method),
    body: body != null ? JSON.stringify(body) : undefined,
    credentials: 'include', // This is needed for CSRF cookies
  });

  // Store CSRF token if present in response headers
  const csrfToken = res.headers.get('X-XSRF-TOKEN');
  if (csrfToken) {
    setCsrfToken(csrfToken);
  }

  let data: any = null;
  try {
    data = await res.json();
  } catch {
    data = null;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.error)) || `${res.status} Error`;
    const err = new Error(msg) as Error & { status?: number; data?: any };
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return { data, response: res };
}

export async function postJson<T = any>(
  path: string,
  body: any,
  opts: Omit<HttpOptions, 'method' | 'body'> = {}
) {
  return http<T>(path, { ...opts, method: 'POST', body });
}

export async function getJson<T = any>(
  path: string,
  opts: Omit<HttpOptions, 'method' | 'body'> = {}
) {
  return http<T>(path, { ...opts, method: 'GET' });
}

export function stripEnvelope<T = any>(payload: any): T {
  // Unwrap common envelope shapes: { result }, { data }, or plain
  return (payload?.result ?? payload?.data ?? payload) as T;
}

// Lightweight health check for the backend (can be used before making critical calls or in a status indicator)
export async function healthCheck(): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE}/actuator/health`, { method: 'GET' });
    if (!res.ok) return false;
    // Spring Boot actuator returns { status: "UP" }
    const data = await res.json().catch(() => null);
    const status = (data?.status || '').toString().toUpperCase();
    return status === 'UP' || res.ok;
  } catch {
    return false;
  }
}
