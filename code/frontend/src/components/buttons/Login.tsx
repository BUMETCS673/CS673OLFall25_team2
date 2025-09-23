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
