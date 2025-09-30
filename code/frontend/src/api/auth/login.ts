// src/api/auth/login.ts
// Centralized login request helper

import { postJson, stripEnvelope } from '../http';

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
  const { data } = await postJson<LoginResponseEnvelope>(
    '/authenticate',
    { username, password },
    { noAuth: true }
  );

  const unwrapped = stripEnvelope<LoginResponseEnvelope>(data);
  const token = (unwrapped as any)?.result?.jwt || (unwrapped as any)?.jwt;
  if (!token) {
    throw new Error('JWT not found in response');
  }

  console.log('Login response data:', data);
  return { token, raw: unwrapped };
}
