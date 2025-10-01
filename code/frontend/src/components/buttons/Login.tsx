/*
 AI-generated code: 20% Formatting help with GPT

 Human code: 80% functions/classes: LoginButtonProps interface, Apply React functional component

 Framework-generated code: 0%
*/

import React from 'react';
import './Login.css';

interface LoginButtonProps {
  onClick: () => void;
}

const LoginButton: React.FC<LoginButtonProps> = ({ onClick }) => {
  return (
    <button className="login-button-simple" onClick={onClick}>
      Login
    </button>
  );
};

export default LoginButton;
