import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import Field from '../components/asideAndToggler/Field';

/*
AI-generated code: 70% (tool: ChatGPT, adapted; functions: structure of test and RTL interactions[https://chatgpt.com/share/68e18e34-9110-8006-b694-a6dadf0cafd5])
Human code (James): 25% (custom onChange mock, assertion logic, expected behavior for selection)
Framework-generated code: 5% (React Testing Library, Jest DOM APIs)
*/

// The popover is rendered via portal into document.body, which RTL supports by default.
test('opens field menu and selects an option, calling onChange', () => {
  const onChange = jest.fn();
  render(<Field onChange={onChange} />);

  // Dispatch the departments event to simulate available departments
  act(() => {
    window.dispatchEvent(
      new CustomEvent('jobs:departments', {
        detail: {
          departments: ['Engineering', 'Marketing', 'Sales'],
          selectedDepartment: null,
        },
      })
    );
  });

  // Open
  const openBtn = screen.getByRole('button', { name: /field/i });
  act(() => {
    fireEvent.click(openBtn);
  });

  // Choose "Engineering"
  const opt = screen.getByRole('option', { name: /engineering/i });
  act(() => {
    fireEvent.click(opt);
  });

  expect(onChange).toHaveBeenCalledWith('Engineering');
  // Button label should now reflect the selection
  expect(
    screen.getByRole('button', { name: /engineering/i })
  ).toBeInTheDocument();
});
