import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import LoginForm from "./LoginForm";
import '@testing-library/jest-dom';

const renderWithRouter = (ui: React.ReactElement) =>
  render(<MemoryRouter>{ui}</MemoryRouter>);

describe("<LoginForm />", () => {
  it("renders heading, fields, and footer link", () => {
    renderWithRouter(<LoginForm showSubmitButton={false} />);

    // heading
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();

    // inputs
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();

    // footer link to /register
    const registerLink = screen.getByRole("link", { name: /register/i });
    expect(registerLink).toBeInTheDocument();
    expect(registerLink).toHaveAttribute("href", "/register");

    // submit button is optional and hidden by default
    expect(screen.queryByRole("button", { name: /login/i })).not.toBeInTheDocument();
  });

  it("shows submit button when showSubmitButton is true", () => {
    renderWithRouter(<LoginForm showSubmitButton />);

    expect(screen.getByRole("button", { name: /login/i })).toBeInTheDocument();
  });

  it("shows validation errors when fields are touched and invalid", async () => {
    const user = userEvent.setup();
    renderWithRouter(<LoginForm showSubmitButton />);

    // blur email without typing
    const email = screen.getByLabelText(/email/i);
    await user.click(email);
    await user.tab(); // move focus away -> triggers onBlur
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    // blur password without typing
    const password = screen.getByLabelText(/password/i);
    await user.click(password);
    await user.tab();
    expect(await screen.findByText(/password is required/i)).toBeInTheDocument();

    // type invalid email format to trigger email-format error
    await user.clear(email);
    await user.type(email, "not-an-email");
    await user.tab();
    expect(await screen.findByText(/enter a valid email/i)).toBeInTheDocument();
  });

  it("calls onSubmit with values when form is valid", async () => {
    const user = userEvent.setup();
    const handleSubmit = vi.fn();

    renderWithRouter(<LoginForm onSubmit={handleSubmit} showSubmitButton />);

    await user.type(screen.getByLabelText(/email/i), "name@example.com");
    await user.type(screen.getByLabelText(/password/i), "supersecret");

    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(handleSubmit).toHaveBeenCalledTimes(1);
    expect(handleSubmit).toHaveBeenCalledWith({
      email: "name@example.com",
      password: "supersecret",
    });
  });
});
