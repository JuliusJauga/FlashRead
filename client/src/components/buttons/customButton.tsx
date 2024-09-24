import React, { useState } from 'react';

const Button: React.FC<{
  label: string;
  onClick: () => void;
  className?: string;
  id?: string;
}> = ({ label, className = '', id = '', onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const buttonStyle = {
    opacity: isClicked ? 0.95 : 1, 
    transition: 'transform 0.4s ease', 
    transform: isHovered ? 'scale(0.95)' : 'scale(1)',
  };

  return (
    <button
      onClick={onClick}
      className={className}
      id={id}
      style={buttonStyle}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setIsClicked(false); // Reset click state when mouse leaves
      }}
      onMouseDown={() => setIsClicked(true)}  // Handle click down
      onMouseUp={() => setIsClicked(false)}   // Handle click release
    >
      {label}
    </button>
  );
};

export default Button;
