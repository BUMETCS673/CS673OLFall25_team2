// ADDED: useNavigate to handle redirection after a successful registration.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link to navigate to Login page
import { isRequired, isEmail } from './validation'; // keep path simple (no .ts extension)
import logo from '../../assets/logo.png'; // Import logo image

/*
 AI-generated code: ~65% 
   - Tool: ChatGPT (link: https://chatgpt.com/share/68d43c9d-4d60-8006-a1a7-14ae49475a5a)
   - Modified and adapted by human
   - Functions/classes: RegisterForm component structure, validation integration, JSX layout
 Human code (James Rose): ~35% 
   - Adjustments: footer text "Already have an account?", fixed link targets, applied centering card layout
   - Functions/classes: human refinements for props, consistent styling with LoginForm
 Framework-generated code: 0%
   - (React/Bootstrap boilerplate is used but not auto-generated)
*/

type RegisterValues = { name: string; email: string; password: string };
type Props = {
  onSubmit?: (values: RegisterValues) => void;
  showSubmitButton?: boolean;
};

// Register form with name, email, and password inputs
// Mirrors LoginForm but adds "name" field
const RegisterForm: React.FC<Props> = ({
  onSubmit,
  showSubmitButton = false,
}) => {
  const [values, setValues] = useState<RegisterValues>({
    name: '',
    email: '',
    password: '',
  });

  // Track touched fields for showing validation feedback
  const [touched, setTouched] = useState<Record<keyof RegisterValues, boolean>>(
    {
      name: false,
      email: false,
      password: false,
    }
  );

  // ADDED: State to manage the API loading status (for disabling the button)
  // and to store any errors returned from the API.
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate(); // ADDED: Hook for navigation

  // Validation: all fields required, email must match format
  const errors = {
    name: !isRequired(values.name) ? 'Name is required' : '',
    email: !isRequired(values.email)
      ? 'Email is required'
      : !isEmail(values.email)
      ? 'Enter a valid email'
      : '',
    password: !isRequired(values.password) ? 'Password is required' : '',
  };

  const hasError = (field: keyof RegisterValues) =>
    touched[field] && !!errors[field];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true as any });
  };

  /*
  // DELETED: The original handleSubmit function was removed.
  // It only handled client-side validation and called an external onSubmit prop.
  const handleSubmit = (e: React.FormEvent) => {
     e.preventDefault();
     setTouched({ name: true, email: true, password: true });
     const valid = !errors.name && !errors.email && !errors.password;
     if (valid && onSubmit) onSubmit(values);
  };
  */

  // ADDED: A new, asynchronous handleSubmit function to replace the old one.
  // This function now handles the complete submission flow: API calls, loading states, and error handling.
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true });
    setApiError(null);

    const valid = !errors.name && !errors.email && !errors.password;
    if (!valid) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // On success, navigate to the login page as per task requirements.
      navigate('/');

    } catch (error: any) {
      setApiError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // Center the card regardless of parent layout; prevent squish
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ width: '100vw', padding: '1rem' }}
    >
      {/* Subtle card container around the form */}
      <div className="card shadow-sm" style={{ width: 380, maxWidth: '100%' }}>
        <div className="card-body">
          {/* App/logo image at top (served from /public) */}
          <img
            src={logo}
            alt="JobTracker"
            className="img-fluid w-100 mb-3"
            style={{ maxHeight: 100, objectFit: 'contain' }}
          />

          <h2 className="h4 text-center mb-4">Register</h2>

          {/* ADDED: A conditional alert to display API errors.
              This element has role="alert" which the test looks for. */}
          {apiError && (
            <div className="alert alert-danger" role="alert">
              {apiError}
            </div>
          )}

          <form className="w-100" noValidate onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="regName" className="form-label">
                Name
              </label>
              <input
                id="regName"
                name="name"
                type="text"
                className={`form-control ${
                  hasError('name') ? 'is-invalid' : ''
                }`}
                value={values.name}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Your full name"
                required
              />
              {hasError('name') && (
                <div className="invalid-feedback">{errors.name}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="regEmail" className="form-label">
                Email
              </label>
              <input
                id="regEmail"
                name="email"
                type="email"
                className={`form-control ${
                  hasError('email') ? 'is-invalid' : ''
                }`}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="name@example.com"
                required
              />
              {hasError('email') && (
                <div className="invalid-feedback">{errors.email}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="regPassword" className="form-label">
                Password
              </label>
              <input
                id="regPassword"
                name="password"
                type="password"
                className={`form-control ${
                  hasError('password') ? 'is-invalid' : ''
                }`}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Create a password"
                required
              />
              {hasError('password') && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            {/* MODIFIED: The button is now disabled based on the isLoading state,
                and its text changes to give user feedback. */}
            {showSubmitButton && (
              <button type="submit" className="btn btn-dark w-100" disabled={isLoading}>
                {isLoading ? 'Registering...' : 'Register'}
              </button>
            )}
          </form>

          {/* Small footer text with link to Login page */}
          <p className="text-center mt-3 mb-0 small">
            Already have an account? {/*modified the website from /login to /*/}
            <Link to="/">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
