/* src/api/apiClient.test.ts
 src/tests/Login.test.tsx

 AI-generated code: 80% Tool: GPT

 Human code: 20% Logic

 Framework-generated code: 0%
*/

import { fetchWithAuth } from './apiClient';
import { NavigateFunction } from 'react-router-dom';

describe('fetchWithAuth API Client', () => {

  // Mock the global fetch function before each test
  beforeEach(() => {
    // --- FIX: Use `window` instead of `global` ---
    jest.spyOn(window, 'fetch').mockResolvedValue({
      ok: true,
      status: 200,
      json: async () => ({ data: 'success' }),
    } as Response);
    
    // Clear localStorage mocks
    localStorage.clear();
    jest.clearAllMocks();
  });

  test('should add Authorization header if token exists in localStorage', async () => {
    // Arrange
    localStorage.setItem('token', 'my-secret-token');

    // Act
    await fetchWithAuth('/api/test');

    // Assert
    // --- FIX: Check the mock on `window` ---
    expect(window.fetch).toHaveBeenCalledWith('/api/test', {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer my-secret-token'
      }
    });
  });
  
  test('should not add Authorization header if no token exists', async () => {
    // Act
    await fetchWithAuth('/api/test');

    // Assert
    // --- FIX: Check the mock on `window` ---
    expect(window.fetch).toHaveBeenCalledWith('/api/test', {
      headers: {
        'Content-Type': 'application/json'
      }
    });
  });

  test('should handle 401 error by clearing token and navigating', async () => {
    // Arrange
    // --- FIX: Use `window` instead of `global` ---
    jest.spyOn(window, 'fetch').mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Unauthorized' }),
    } as Response);

    localStorage.setItem('token', 'expired-token');
    const mockNavigate = jest.fn() as NavigateFunction;
    const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

    // Act & Assert
    await expect(fetchWithAuth('/api/protected', {}, mockNavigate)).rejects.toThrow('Unauthorized');

    // Assert
    expect(removeItemSpy).toHaveBeenCalledWith('token');
    expect(mockNavigate).toHaveBeenCalledWith('/unauthorized');
  });
});