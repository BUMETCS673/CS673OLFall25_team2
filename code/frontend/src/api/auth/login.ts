// src/api/auth/login.ts
// Centralized login request helper

import { postJson, stripEnvelope } from '../http';

export type LoginResponseEnvelope = {
  token?: string;
  user?: {
    id?: string;
    name?: string;
    email?: string;
  };
  message?: string;
  error?: string;
  status?: number;
  [k: string]: any;
};

export async function login(
  username: string,
  password: string
): Promise<{ token: string; raw: LoginResponseEnvelope }> {
  // Normalize input
  const trimmedEmail = (username || '').trim();
  console.log('Attempting login with:', { email: trimmedEmail });

  // IMPORTANT: ensure we never send stale tokens on the login call
  try {
    localStorage.removeItem('jwt');
    localStorage.removeItem('csrfToken'); // Also clear any stale CSRF token
  } catch {}

  try {
    const { data } = await postJson<LoginResponseEnvelope>(
      '/auth/login',
      { email: trimmedEmail, password },
      {
        // forces http.ts to skip Authorization header
        noAuth: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const unwrapped = stripEnvelope<LoginResponseEnvelope>(data);
    const token = (unwrapped as any)?.token;
    if (!token) {
      throw new Error('JWT not found in response');
    }

    // Persist fresh token
    try {
      localStorage.setItem('jwt', token);
    } catch {}

    console.log('Login response data:', data);
    return { token, raw: unwrapped };
  } catch (error: any) {
    console.error('Login error:', error);

    // Map common statuses to friendly messages
    if (error?.status === 401) {
      throw new Error('Invalid email or password');
    }
    if (error?.status === 403) {
      // Most common cause in browsers is a stray Authorization/Cookie;
      // we already cleared JWT above, so if this persists check proxy logs.
      throw new Error('Account is not active or request was rejected');
    }
    throw error;
  }
}
