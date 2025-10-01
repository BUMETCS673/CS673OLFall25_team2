// src/api/auth/login.ts
// Centralized login request helper

export type LoginResponseEnvelope = {
  success?: boolean;
  result?: { jwt?: string };
  jwt?: string;
  message?: string;
  error?: string;
  [k: string]: any;
};

export async function login(
  username: string,
  password: string
): Promise<{ token: string; raw: LoginResponseEnvelope }> {
  const API_BASE =
    (import.meta as any)?.env?.VITE_API_BASE_URL || 'http://localhost:8080/api';

  const res = await fetch(`${API_BASE}/authenticate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });

  const data: LoginResponseEnvelope = await res
    .json()
    .catch(() => ({} as LoginResponseEnvelope));

  if (!res.ok) {
    const msg = data?.message || data?.error || `Login failed (${res.status})`;
    throw new Error(msg);
  }

  const token = data?.result?.jwt || data?.jwt;
  if (!token) {
    throw new Error('JWT not found in response');
  }

  return { token, raw: data };
}
