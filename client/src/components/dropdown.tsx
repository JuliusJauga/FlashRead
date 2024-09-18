import React, { useState, CSSProperties, useRef, useEffect } from 'react';

interface DropdownProps {
    onSelect: (item: string) => void;
}

const Dropdown: React.FC<DropdownProps> = ({ onSelect }) => {
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
        border: '4px solid #FFF8E8',
        backgroundColor: 'transparent',
        color: '#FFF8E8',
        transform: isHovered ? 'scale(0.95)' : 'scale(1)',
        fontSize: '26px',
        fontFamily: 'Georgia, serif',
        cursor: 'pointer',
        width: `${buttonSize}px`, 
        height: '100%',
        zIndex: 99,
        boxSizing: 'border-box', 
    };

    const dropdownMenuStyle: CSSProperties = {
        position: 'absolute',
        top: '100%',
        left: 'auto',
        right: '0',  // Align the dropdown with the button's right side
        backgroundColor: '#FFF8E8',
        border: '4px solid #FFF8E8',
        listStyle: 'none',
        padding: '0',
        margin: '0',
        width: 'auto',
        minWidth: '100px', 
        boxSizing: 'border-box',
        zIndex: 100,
        borderRadius: '12px',
        opacity: isOpen ? 1 : 0,
        transition: 'opacity 0.4s ease',
        whiteSpace: 'nowrap',
    };

    const menuItemStyle: CSSProperties = {
        padding: '10px 20px',
        borderBottom: '1px solid #CCC',
        cursor: 'pointer',
        backgroundColor: '#FFF8E8',
        color: '#333',
        fontSize: '20px',
        fontFamily: 'Georgia, serif',
        whiteSpace: 'nowrap',
    };

    const menuItemHoverStyle: CSSProperties = {
        backgroundColor: '#F0E8D8',
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
                {/*icon */}
            </button>
            {isOpen && (
                <ul style={dropdownMenuStyle}>
                    {['Profile', 'Settings', 'Login'].map((option, index) => (
                        <li
                            key={index}
                            style={menuItemStyle}
                            onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = menuItemHoverStyle.backgroundColor || '#F0E8D8')}
                            onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#FFF8E8')}
                            onClick={() => selectItem(option)}
                        >
                            {option}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Dropdown;
