import React, { useState, CSSProperties, useRef, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { login } from '../services/authService';
interface DropdownProps {
    onSelect: (item: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onSelect }) => {
    const { checkUserAuth, isAuthenticated } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [buttonSize, setButtonSize] = useState<number>(0);
    
    const buttonRef = useRef<HTMLButtonElement>(null);

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const selectItem = (item: string) => {
        setIsOpen(false);  // Close dropdown on item selection
        onSelect(item);    // Call the passed-in callback function
    };

    // Update the button size to match height
    useEffect(() => {
        if (buttonRef.current) {
            setButtonSize(buttonRef.current.offsetHeight); // Set the width based on height
        }
    }, [buttonRef]);

    const buttonStyle: CSSProperties = {
        opacity: isClicked ? 0.95 : 1,
        transition: 'transform 0.4s ease',
        outline: 'none',
        borderRadius: '12px',
        border: '4px solid var(--borderColor)',
        backgroundColor: 'transparent',
        color: 'var(--textColor)',
        transform: isHovered ? 'scale(0.95)' : 'scale(1)',
        fontSize: '26px',
        fontFamily: 'var(--fontStyle)', 
        cursor: 'pointer',
        width: `${buttonSize}px`, 
        height: '100%',
        zIndex: 99,
        boxSizing: 'border-box', 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        paddingBottom: '3px'
    };

    const dropdownMenuStyle: CSSProperties = {
        position: 'absolute',
        top: '100%',
        left: 'auto',
        right: '0',  // Align the dropdown with the button's right side
        border: '4px solid var(--borderColor)',
        backgroundColor: 'transparent',
        
        listStyle: 'none',
        padding: '0',
        margin: '0',
        width: 'auto',
        minWidth: '100px', 
        boxSizing: 'border-box',
        zIndex: 100,
        borderRadius: '12px',
        opacity: isOpen ? 1 : 0,
        transform: isOpen ? 'scale(1)' : 'scale(0)', // Scale dropdown menu on open/close
        transformOrigin: 'top right',
        transition: 'opacity 0.4s ease, transform 0.4s ease', // Smooth transition
        whiteSpace: 'nowrap',
    };

    const menuItemStyle: CSSProperties = {
        padding: '10px 20px',
        cursor: 'pointer',
        color: 'var(--textColor)',
        fontSize: '20px',
        fontFamily: 'var(--fontStyle)', 
        whiteSpace: 'nowrap',
    };

    const menuItemHoverStyle: CSSProperties = {
        backgroundColor: 'rgba(240,232,216,0.4)',
    };

    return (
        <div className="dropdown" style={{ position: 'relative', height: '100%', width: '50%' }}>  {/* width of the dropdown */}
            <button
                ref={buttonRef}
                onClick={toggleDropdown}
                style={buttonStyle}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => {
                    setIsHovered(false);
                    setIsClicked(false);
                }}
                onMouseDown={() => setIsClicked(true)}
                onMouseUp={() => setIsClicked(false)}
            >
                &#8801;
            </button>
            <ul style={dropdownMenuStyle}>
                {['Profile', 'Settings', isAuthenticated ? 'Logout' : 'Login'].map((option, index) => (
                    <li
                        key={index}
                        style={menuItemStyle}
                        onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor || 'rgba(240,232,216,0.4)')}
                        onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                        onClick={() => selectItem(option)}
                    >
                        {option}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dropdown;
