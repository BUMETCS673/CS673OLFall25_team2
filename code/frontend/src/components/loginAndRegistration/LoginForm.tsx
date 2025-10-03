// ADDED: useNavigate to handle redirection after a successful login.
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Link to navigate to Register page
import { isRequired } from './validation'; // keep path simple (no .ts extension)
import logo from '../../assets/logo.png'; // Import logo image
import { login as loginRequest } from '../../api/auth/login';

/*
 AI-generated code: ~70% 
   - Tool: ChatGPT (link: https://chatgpt.com/share/68d43c9d-4d60-8006-a1a7-14ae49475a5a)
   - Modified and adapted by human
   - Functions/classes: LoginForm component structure, validation logic integration, JSX layout
 Human code (James Rose): ~30% 
   - Adjustments: added centering fixes, styled footer text, ensured responsive Bootstrap card
   - Functions/classes: final layout tweaks, style adjustments, props handling refinements
 Framework-generated code: 0%
   - (React/Bootstrap boilerplate is used but not auto-generated)

   // Human (Pedro) refined the code 30%
*/

/**
 * @typedef {Object} LoginValues
 * @property {string} username
 * @property {string} password
 */
type LoginValues = {
  username: string;
  password: string;
};

type Props = {
  // Optional: parent can pass a submit handler
  onSubmit?: (values: LoginValues) => void;
  // Toggle submit button visibility (button creation is in a different story)
  showSubmitButton?: boolean;
};

// Login form with username + password fields, calls backend to get JWT and saves it
const LoginForm: React.FC<Props> = ({ onSubmit, showSubmitButton = false }) => {
  const navigate = useNavigate();
  // Controlled state for form fields
  const [values, setValues] = useState<LoginValues>({
    username: '',
    password: '',
  });

  // Track which fields the user has interacted with
  // Used to show errors only after user touches/leaves a field
  const [touched, setTouched] = useState<Record<keyof LoginValues, boolean>>({
    username: false,
    password: false,
  });

  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  // Validation rules (errors show if not empty/invalid email)
  const errors = {
    username: !isRequired(values.username) ? 'Username is required' : '',
    password: !isRequired(values.password) ? 'Password is required' : '',
  } as const;

  const hasError = (field: keyof LoginValues) =>
    touched[field] && !!errors[field];

  // Update field values
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  // Mark field as "touched" on blur
  const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  // Prevent submission if validation fails
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ username: true, password: true });
    setServerError(null);
    setSuccessMsg(null);
    const valid = !errors.username && !errors.password;
    if (!valid) return;

    // Allow parent to intercept if provided
    if (onSubmit) onSubmit(values);

    try {
      setLoading(true);
      const { token, raw } = await loginRequest(
        values.username,
        values.password
      );

      localStorage.setItem('jwt', token);
      try {
        localStorage.setItem('auth', JSON.stringify(raw));
      } catch {}

      setSuccessMsg('Logged in successfully. Token saved.');
      navigate('/content', { replace: true });
    } catch (err: any) {
      setServerError(err?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    // Center the card regardless of parent layout; prevent squish
    <div
      className="d-flex flex-column align-items-center justify-content-center mt-4"
      style={{ width: '100vw', padding: '1rem' }}
    >
      <h6 className="text-muted fw-bold text-capitalize mb-3">
        Your job hunt, organized.
      </h6>
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

          <h1 className="h4 text-center mb-4">Login</h1>

          {serverError && (
            <div className="alert alert-danger py-2" role="alert">
              {serverError}
            </div>
          )}
          {successMsg && (
            <div className="alert alert-success py-2" role="alert">
              {successMsg}
            </div>
          )}

          <form className="w-100" noValidate onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="loginUsername" className="form-label">
                Username
              </label>
              <input
                id="loginUsername"
                name="username"
                type="text"
                className={`form-control ${
                  hasError('username') ? 'is-invalid' : ''
                }`}
                value={values.username}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Your username"
                required
              />
              {hasError('username') && (
                <div className="invalid-feedback">{errors.username}</div>
              )}
            </div>

            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">
                Password
              </label>
              <input
                id="loginPassword"
                name="password"
                type="password"
                className={`form-control ${
                  hasError('password') ? 'is-invalid' : ''
                }`}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                required
              />
              {hasError('password') && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            {/* MODIFIED: The button is now disabled based on the isLoading state,
                and its text changes to give user feedback. */}
            {showSubmitButton && (
              <button
                type="submit"
                className="btn btn-dark w-100"
                disabled={loading}
              >
                {loading ? 'Logging in…' : 'Login'}
              </button>
            )}
          </form>

          {/* Small footer text with link to Register page */}
          <div className="text-center mt-3 mb-0 small">
            Don’t have an account? <Link to="/register">Register</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
