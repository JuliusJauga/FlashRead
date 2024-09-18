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
    transition: 'transform 0.4s ease', // Smooth transitions
    outline: 'none',
    padding: '10px 20px', // Padding inside the button
    borderRadius: '12px',
    border: '2px solid #000000', // Border color
    backgroundColor: 'transparent',
    color: '#000000', // Text color
    transform: isHovered ? 'scale(0.95)' : 'scale(1)', // Shrink button on hover
    fontSize: '16px',
    fontWeight: 'bold',
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
