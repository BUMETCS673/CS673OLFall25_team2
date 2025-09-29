import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Link to navigate to Register page
import { isRequired, isEmail } from './validation'; // keep path simple (no .ts extension)
import logo from '../../assets/logo.png'; // Import logo image

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
*/

/**
 * @typedef {Object} LoginValues
 * @property {string} email
 * @property {string} password
 */
type LoginValues = {
  email: string;
  password: string;
};

type Props = {
  // Optional: parent can pass a submit handler
  onSubmit?: (values: LoginValues) => void;
  // Toggle submit button visibility (button creation is in a different story)
  showSubmitButton?: boolean;
};

// Login form with email + password fields, Bootstrap styling, and basic validation
const LoginForm: React.FC<Props> = ({ onSubmit, showSubmitButton = false }) => {
  // Controlled state for form fields
  const [values, setValues] = useState<LoginValues>({
    email: '',
    password: '',
  });

  // Track which fields the user has interacted with
  // Used to show errors only after user touches/leaves a field
  const [touched, setTouched] = useState<Record<keyof LoginValues, boolean>>({
    email: false,
    password: false,
  });

  // Validation rules (errors show if not empty/invalid email)
  const errors = {
    email: !isRequired(values.email)
      ? 'Email is required'
      : !isEmail(values.email)
      ? 'Enter a valid email'
      : '',
    password: !isRequired(values.password) ? 'Password is required' : '',
  };

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const valid = !errors.email && !errors.password;
    if (valid && onSubmit) onSubmit(values);
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

          <form className="w-100" noValidate onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">
                Email
              </label>
              <input
                id="loginEmail"
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

            {/* Black, full-width login button (rendered only if allowed by story flag) */}
            {showSubmitButton && (
              <button type="submit" className="btn btn-dark w-100">
                Login
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
