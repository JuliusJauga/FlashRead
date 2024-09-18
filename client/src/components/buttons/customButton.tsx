import React, { useState } from 'react';

const Button: React.FC<{
  label: string;
  onClick: () => void;
  className?: string;
}> = ({ label, className = '', onClick }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const buttonStyle = {
    opacity: isClicked ? 0.95 : 1, // Adjust opacity when clicked
    transition: 'opacity 0.3s ease, border-color 0.3s ease', // Smooth transitions
    outline: 'none', // Remove blue outline
    border: isHovered ? '2px solid black' : '2px solid transparent', // Black border on hover
    padding: '10px 20px', // Padding inside the button
    borderRadius: '8px', // Optional: Rounded corners
  };

  return (
    <button
      onClick={onClick}
      className={className}
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