import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import RegisterForm from "./RegisterForm";

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("<RegisterForm />", () => {
  it("renders heading, name/email/password fields, and footer link to Login", () => {
    renderWithRouter(<RegisterForm showSubmitButton={false} />);

    // heading
    expect(screen.getByRole("heading", { name: /register/i })).toBeInTheDocument();

    // inputs
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // footer link
    const loginLink = screen.getByRole("link", { name: /login/i });
    expect(loginLink).toBeInTheDocument();
    expect(loginLink).toHaveAttribute("href", "/login");

    // submit button hidden by default
    expect(screen.queryByRole("button", { name: /register/i })).not.toBeInTheDocument();
  });

  it("shows the submit button when showSubmitButton is true", () => {
    renderWithRouter(<RegisterForm showSubmitButton />);
    expect(screen.getByRole("button", { name: /register/i })).toBeInTheDocument();
  });

  it("shows validation messages when fields are touched and invalid", async () => {
    const user = userEvent.setup();
    renderWithRouter(<RegisterForm showSubmitButton />);

    const name = screen.getByLabelText(/name/i);
    const email = screen.getByLabelText(/email/i);
    const password = screen.getByLabelText(/password/i);

    // blur each empty field to trigger "required"
    await user.click(name);
    await user.tab();
    expect(await screen.findByText(/name is required/i)).toBeInTheDocument();

    await user.click(email);
    await user.tab();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    await user.click(password);
    await user.tab();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();

    // invalid email format
    await user.clear(email);
    await user.type(email, "not-an-email");
    await user.tab();
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("calls onSubmit with form values when valid", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    renderWithRouter(<RegisterForm onSubmit={handleSubmit} showSubmitButton />);

    await user.type(screen.getByLabelText(/name/i), "Taylor Dev");
    await user.type(screen.getByLabelText(/email/i), "taylor@example.com");
    await user.type(screen.getByLabelText(/password/i), "s3cret!");

    await user.click(screen.getByRole("button", { name: /register/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      name: "Taylor Dev",
      email: "taylor@example.com",
      password: "s3cret!",
    });
  });
});