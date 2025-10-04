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
  // Trim the email to remove any whitespace
  const trimmedEmail = username.trim();
  console.log('Attempting login with:', { email: trimmedEmail });

  try {
    const { data } = await postJson<LoginResponseEnvelope>(
      '/auth/login',
      { email: trimmedEmail, password },
      {
        noAuth: true,
        headers: { 'Content-Type': 'application/json' },
      }
    );

    const unwrapped = stripEnvelope<LoginResponseEnvelope>(data);
    const token = (unwrapped as any)?.token;
    if (!token) {
      throw new Error('JWT not found in response');
    }

    console.log('Login response data:', data);
    return { token, raw: unwrapped };
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.status === 401) {
      throw new Error('Invalid email or password');
    } else if (error.status === 403) {
      throw new Error('Account is not active');
    } else {
      throw error;
    }
  }
}
