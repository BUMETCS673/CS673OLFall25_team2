/*
 AI-generated code: 0%

 Human code: 100% functions/classes: LoginButtonProps interface, Apply React functional component

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
