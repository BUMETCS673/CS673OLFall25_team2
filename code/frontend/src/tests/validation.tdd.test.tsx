import { isRequired, isEmail } from '../components/loginAndRegistration/validation';

/*
AI-generated code: 95% (tool: ChatGPT, adapted; test scaffolding and helper structure)
Human code (James): 0%
Framework-generated code: 5% (Jest test runner functions)
*/

describe('validation helpers', () => {
  test('isRequired rejects empty/whitespace', () => {
    expect(isRequired('')).toBe(false);
    expect(isRequired('   ')).toBe(false);
    expect(isRequired('ok')).toBe(true);
  });


  test('isEmail basic format check', () => {
    expect(isEmail('')).toBe(false);
    expect(isEmail('hello')).toBe(false);
    expect(isEmail('a@b')).toBe(false);
    expect(isEmail('jane.doe@example.com')).toBe(true);
  });
 
});
