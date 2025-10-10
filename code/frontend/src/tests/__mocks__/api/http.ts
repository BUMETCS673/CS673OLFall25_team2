// Mock for http.ts
export const API_BASE = 'http://localhost:8080/api';

export const postJson = jest.fn(async () => ({
  data: {
    success: true,
    result: { user: { id: 1, username: 'test', email: 'test@example.com' } },
  },
  response: { headers: new Map() },
}));

export const stripEnvelope = jest.fn((data: any) => data.result);
