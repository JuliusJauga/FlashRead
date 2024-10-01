import React, { useState } from 'react';

const Button: React.FC<{
    label: string;
    onClick: () => void;
    className?: string;
    id?: string;
    style?: React.CSSProperties;
}> = ({ label, className = '', id = '', onClick, style }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);

    const buttonStyle: React.CSSProperties = {
        opacity: isClicked ? 0.95 : 1, // Adjust opacity when clicked
        transition: 'transform 0.4s ease', // Smooth transitions
        transform: isHovered ? 'scale(0.95)' : 'scale(1)', // Shrink button on hover
        ...style, // Merge with custom styles
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
