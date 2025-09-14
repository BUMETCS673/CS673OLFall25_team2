// Basic validation helpers shared by Login and Register forms

// Check that a value is not empty/whitespace
export const isRequired = (v: string) => v.trim().length > 0;

// Simple regex check for email format
export const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());