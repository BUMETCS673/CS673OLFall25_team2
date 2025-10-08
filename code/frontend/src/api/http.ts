// src/api/http.ts
// Lightweight HTTP client wrapper with JSON and auth support
// Copilot generated with manual tweaks
// Human review and adjustments made for clarity and functionality
// 30% AI-generated, 70% human refined

import.meta.env.VITE_API_BASE_URL;

const _env = (import.meta as any)?.env;
export const API_BASE: string =
  _env?.VITE_API_BASE_URL ||
  (_env?.PROD ? 'http://54.227.173.227/api' : 'http://localhost:8080/api');

export type HttpOptions = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  headers?: Record<string, string>;
  body?: any;
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
