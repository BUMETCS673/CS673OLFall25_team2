// Mock for register.ts
import type {
  RegisterPayload,
  RegisteredUser,
} from '../../../../api/auth/register';

export const register = jest.fn(
  async (
    payload: RegisterPayload
  ): Promise<{ user: RegisteredUser; location?: string; raw?: any }> => {
    return {
      user: {
        id: 1,
        username: payload.email,
        email: payload.email,
        firstName: payload.name.split(' ')[0],
        lastName: payload.name.split(' ')[1] || '',
        userType: 'user',
        isActive: true,
      },
      location: '/users/1',
      raw: { success: true },
    };
  }
);
