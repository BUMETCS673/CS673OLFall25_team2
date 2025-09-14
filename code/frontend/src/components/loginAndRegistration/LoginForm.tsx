import React, { useState } from "react";
import { Link } from "react-router-dom"; // Link to navigate to Register page
import { isRequired, isEmail } from "./validation"; // keep path simple (no .ts extension)

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
  const [values, setValues] = useState<LoginValues>({ email: "", password: "" });

  // Track which fields the user has interacted with
  // Used to show errors only after user touches/leaves a field
  const [touched, setTouched] = useState<Record<keyof LoginValues, boolean>>({
    email: false,
    password: false,
  });

  // Validation rules (errors show if not empty/invalid email)
  const errors = {
    email:
      !isRequired(values.email) ? "Email is required" :
      !isEmail(values.email) ? "Enter a valid email" : "",
    password: !isRequired(values.password) ? "Password is required" : "",
  };

  const hasError = (field: keyof LoginValues) => touched[field] && !!errors[field];

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
      className="d-flex align-items-center justify-content-center"
      style={{ minHeight: "100vh", width: "100vw", padding: "1rem" }}
    >
      {/* Subtle card container around the form */}
      <div className="card shadow-sm" style={{ width: 380, maxWidth: "100%" }}>
        <div className="card-body">
          {/* App/logo image at top (served from /public) */}
          <img
            src="/logo.png"
            alt="JobTracker"
            className="img-fluid w-100 mb-3"
            style={{ maxHeight: 64, objectFit: "contain" }}
          />

          <h2 className="h4 text-center mb-4">Login</h2>

          <form className="w-100" noValidate onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="loginEmail" className="form-label">Email</label>
              <input
                id="loginEmail"
                name="email"
                type="email"
                className={`form-control ${hasError("email") ? "is-invalid" : ""}`}
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="name@example.com"
                required
              />
              {hasError("email") && <div className="invalid-feedback">{errors.email}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="loginPassword" className="form-label">Password</label>
              <input
                id="loginPassword"
                name="password"
                type="password"
                className={`form-control ${hasError("password") ? "is-invalid" : ""}`}
                value={values.password}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="••••••••"
                required
              />
              {hasError("password") && (
                <div className="invalid-feedback">{errors.password}</div>
              )}
            </div>

            {/* Black, full-width login button (rendered only if allowed by story flag) */}
            {showSubmitButton && (
              <button type="submit" className="btn btn-dark w-100">Login</button>
            )}
          </form>

          {/* Small footer text with link to Register page */}
          <p className="text-center mt-3 mb-0 small">
            Don’t have an account?{" "}
            <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;