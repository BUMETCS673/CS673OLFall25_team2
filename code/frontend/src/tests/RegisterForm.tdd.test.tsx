import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import RegisterForm from '../components/loginAndRegistration/RegisterForm';
import { MemoryRouter } from 'react-router-dom';
import { ThemeProvider } from '../theme/ThemeContext';

// Mock the HTTP module to avoid Vite import.meta issues
jest.mock('../api/http', () => ({
  API_BASE: 'http://localhost:8080/api',
  postJson: jest.fn(),
  stripEnvelope: jest.fn((data) => data.result),
}));

// Mock the register function
const registerMock = jest.fn().mockResolvedValue({
  user: {
    id: 1,
    username: 'james@example.com',
    email: 'james@example.com',
    firstName: 'James',
    lastName: '',
    userType: 'user',
  },
});
jest.mock('../api/auth/register', () => ({
  register: (payload: any) => registerMock(payload),
}));

// Mock navigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => {
  const actual = jest.requireActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockedNavigate,
  };
});

/*
AI-generated code: 70% (tool: ChatGPT, adapted; helper fill function, structure of test case)
Human code: 25% (custom assertion flow, expected form submission payloads)
Framework-generated code: 5% (React Testing Library, Jest DOM APIs)
*/

function fill(input: HTMLElement, value: string) {
  fireEvent.change(input, { target: { value } });
  fireEvent.blur(input);
}

describe('RegisterForm', () => {
  beforeEach(() => {
    mockedNavigate.mockClear();
    registerMock.mockClear();

    // Mock setTimeout to execute immediately
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  test('requires name, email, password; submits when valid', async () => {
    const onSubmit = jest.fn();
    render(
      <MemoryRouter>
        <ThemeProvider>
          <RegisterForm onSubmit={onSubmit} showSubmitButton />
        </ThemeProvider>
      </MemoryRouter>
    );

    const name = screen.getByLabelText(/name/i);
    const email = screen.getByLabelText(/^email$/i);
    const password = screen.getByLabelText(/password/i);

    // Trigger errors
    fireEvent.blur(name);
    fireEvent.blur(email);
    fireEvent.blur(password);
    expect(screen.getByText(/name is required/i)).toBeInTheDocument();
    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();

    // Fill valid values and submit
    fill(name, 'James');
    fill(email, 'james@example.com');
    fill(password, 'secret123');
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'James',
      email: 'james@example.com',
      password: 'secret123',
    });
  });

  test('calls register API and navigates on successful registration', async () => {
    render(
      <MemoryRouter>
        <ThemeProvider>
          <RegisterForm showSubmitButton />
        </ThemeProvider>
      </MemoryRouter>
    );

    // Fill in the form with valid data
    fill(screen.getByLabelText(/name/i), 'James Smith');
    fill(screen.getByLabelText(/^email$/i), 'james@example.com');
    fill(screen.getByLabelText(/password/i), 'password123');

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    // Check the API was called with the correct data
    await waitFor(() => {
      expect(registerMock).toHaveBeenCalledWith({
        name: 'James Smith',
        email: 'james@example.com',
        password: 'password123',
      });
    });

    // Advance timers to trigger the navigation
    jest.runAllTimers();

    // Check navigation happened
    await waitFor(() => {
      expect(mockedNavigate).toHaveBeenCalledWith('/login', expect.anything());
    });
  });
});
