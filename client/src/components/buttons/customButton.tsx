import React from 'react';

const Button: React.FC<{
  label: string;
  onClick: () => void;
//   disabled?: boolean;
  className?: string;
}> = ({ label, className = '', onClick }) => {
  return (
    <button
      onClick={onClick}
    //   disabled={disabled}
      className={`btn ${className}`} // You can use custom styling here
    >
      {label}
    </button>
  );
};

export default Button;