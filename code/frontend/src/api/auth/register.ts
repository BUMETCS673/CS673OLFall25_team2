// src/api/auth/register.ts
// Centralized register request helper

import { postJson, stripEnvelope } from '../http';

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  userType: 'EMPLOYEE';
};

export type RegisteredUser = {
  id: number;
  username: string;
  email: string;
  firstName: string;
  lastName: string;
  userType: string;
  isActive?: boolean;
};

export async function register(
  payload: RegisterPayload
): Promise<{ user: RegisteredUser; location?: string; raw?: any }> {
  const { data, response } = await postJson<any>(
    '/public/users/register',
    payload,
    { noAuth: true }
  );

  const location = response.headers.get('Location') || undefined;
  console.log('Register response data:', data);

  const unwrapped = stripEnvelope<any>(data);
  const user: RegisteredUser = unwrapped?.user || unwrapped;
  if (!user || !user.username) {
    throw new Error('Unexpected register response shape');
  }
  return { user, location, raw: data };
}
