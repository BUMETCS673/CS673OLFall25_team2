// src/api/http.ts
// Minimal HTTP utilities for API calls

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
  // When true, do not attach auth header
  noAuth?: boolean;
};

export function getAuthToken(): string | null {
  try {
    return localStorage.getItem('jwt');
  } catch {
    return null;
  }
}

export function buildHeaders(
  headers?: Record<string, string>,
  noAuth?: boolean
): HeadersInit {
  const base: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(headers || {}),
  };
  if (!noAuth) {
    const token = getAuthToken();
    if (token) base['Authorization'] = `Bearer ${token}`;
  }
  return base;
}

export async function http<T = any>(
  path: string,
  { method = 'GET', headers, body, noAuth }: HttpOptions = {}
): Promise<{ data: T; response: Response }> {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: buildHeaders(headers, noAuth),
    body: body != null ? JSON.stringify(body) : undefined,
  });

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
