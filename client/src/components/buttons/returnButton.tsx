import React from 'react';

const Button: React.FC<{
  label: string;
  onClick: () => void;
  className?: string;
}> = ({ label, className = '', onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`btn ${className}`}
    >
      {label}
    </button>
  );
};

export default Button;