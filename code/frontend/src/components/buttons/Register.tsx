/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: RegisterButtonProps interface, Apply React functional component

 Framework-generated code: 0%
*/


import React from 'react';
import './Register.css';

interface RegisterButtonProps {
  onClick: () => void;
}

const RegisterButton: React.FC<RegisterButtonProps> = ({ onClick }) => {
  return (
    <button className="auth-button" onClick={onClick}>
      Register
    </button>
  );
};

export default RegisterButton;
