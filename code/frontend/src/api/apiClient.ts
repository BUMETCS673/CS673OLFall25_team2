/* src/api/apiClient.ts
 src/tests/Login.test.tsx

 AI-generated code: 80% Tool: GPT

 Human code: 20% Logic

 Framework-generated code: 0%
*/

// The navigate function type from React Router
import { NavigateFunction } from 'react-router-dom';

export const fetchWithAuth = async (
  url: string,
  options: RequestInit = {},
  // Add an optional navigate parameter
  navigate?: NavigateFunction 
): Promise<Response> => {
  const token = localStorage.getItem('token');

  const headers = {
    ...options.headers,
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, { ...options, headers });

  if (response.status === 401) {
    localStorage.removeItem('token');
    
    // --- THIS IS THE CHANGE ---
    // If a navigate function is provided (like in our components), use it.
    // Otherwise, fall back to the global method.
    if (navigate) {
      navigate('/unauthorized');
    } else {
      window.location.href = '/unauthorized';
    }

    throw new Error('Unauthorized');
  }

  return response;
};