// src/api/auth/register.ts
// Centralized register request helper

import { postJson, stripEnvelope } from '../http';

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
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
  const { data, response } = await postJson<any>('/auth/register', payload, {
    noAuth: true,
    noCsrf: true, // Registration endpoint is CSRF-exempt
  });

  const location = response.headers.get('Location') || undefined;
  console.log('Register response data:', data);

  // Backend returns { token: string, user: RegisteredUser }
  const unwrapped = stripEnvelope<any>(data);
  const user = unwrapped?.user || {};

  if (!user) {
    throw new Error('User data not found in response');
  }

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      userType: user.userType,
      isActive: user.isActive,
    },
    location,
    raw: data,
  };
}
