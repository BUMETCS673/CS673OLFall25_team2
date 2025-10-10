/*
 AI-generated code: ~50% 
   - Tool: ChatGPT (link: https://chatgpt.com/share/68d43c9d-4d60-8006-a1a7-14ae49475a5a)
   - Functions/classes: isRequired, isEmail utility functions suggested by AI
 Human code: ~50% 
   - Adjustments: simplified regex validation, added doc comments, integration testing with forms
 Framework-generated code: 0%
   - (Plain TypeScript helpers, no framework generation)
*/

// Basic validation helpers shared by Login and Register forms
// Check that a value is not empty/whitespace
export const isRequired = (v: string) => v.trim().length > 0;

// Simple regex check for email format
export const isEmail = (v: string) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
