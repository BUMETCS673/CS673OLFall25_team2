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
