/* src/tests/Login.test.tsx

 AI-generated code: 80% Tool: GPT

 Human code: 20% Logic

 Framework-generated code: 0%
*/

import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import LoginForm from '../components/loginAndRegistration/LoginForm';

// Mock the global fetch function before each test
global.fetch = jest.fn();

// Mock react-router-dom's useNavigate hook
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain all actual functionalities
  useNavigate: () => mockedNavigate, // But hijack useNavigate
  Link: (props: any) => <a {...props}>{props.children}</a>, // Simple mock for Link
}));

describe('LoginForm', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    (fetch as jest.Mock).mockClear();
    mockedNavigate.mockClear();
  });

  // Test case 1: Client-side validation
  test('should show validation errors for invalid email and empty password and not submit', () => {
    render(
      <BrowserRouter>
        <LoginForm showSubmitButton={true} />
      </BrowserRouter>
    );

    const submitButton = screen.getByRole('button', { name: /login/i });

    // Try to submit with invalid email
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'invalid-email' } });
    fireEvent.click(submitButton);

    // Assert error message is shown and fetch was not called
    expect(screen.getByText('Enter a valid email')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();

    // Try to submit with empty password
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: '' } });
    fireEvent.click(submitButton);

    // Assert error message is shown and fetch was not called
    expect(screen.getByText('Password is required')).toBeInTheDocument();
    expect(fetch).not.toHaveBeenCalled();
  });

  // Test case 2: Successful login flow
  test('should call login API, store token, and navigate on successful submission', async () => {
    // Mock a successful fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ token: 'fake-jwt-token' }),
    });

    // Mock localStorage
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');

    render(
      <BrowserRouter>
        <LoginForm showSubmitButton={true} />
      </BrowserRouter>
    );

    // Fill out the form with valid credentials
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Assert that the API was called correctly
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'test@example.com', password: 'password123' }),
      });
    });

    // Assert that the token was stored and navigation occurred
    expect(setItemSpy).toHaveBeenCalledWith('token', 'fake-jwt-token');
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard'); // Or wherever it should go

    setItemSpy.mockRestore(); // Clean up spy
  });

  // Test case 3: 401/500 Error Handling
  test('should show an alert on 401 or 500 error from the API', async () => {
    // Mock a failed fetch response
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 401,
      json: async () => ({ message: 'Invalid credentials' }),
    });

    render(
      <BrowserRouter>
        <LoginForm showSubmitButton={true} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'wrong@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'wrongpassword' } });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    // Wait for the error message to appear and assert it has role="alert"
    const alert = await screen.findByRole('alert');
    expect(alert).toHaveTextContent('Invalid credentials');
  });

  // Test case 4: Submit button disabled while in-flight
  test('should disable the submit button while the form is submitting', async () => {
    // Create a mock fetch that takes time to resolve
    (fetch as jest.Mock).mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ ok: true, json: async () => ({ token: 'token' }) }), 100)));

    render(
      <BrowserRouter>
        <LoginForm showSubmitButton={true} />
      </BrowserRouter>
    );

    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });

    const submitButton = screen.getByRole('button', { name: /login/i });
    fireEvent.click(submitButton);

    // Immediately after clicking, the button should be disabled
    expect(submitButton).toBeDisabled();

    // Wait for the process to complete, and the button should be re-enabled
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });
});
