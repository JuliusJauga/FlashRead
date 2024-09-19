import React from 'react';
import "./hyperlink.css";

interface CustomHyperlinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

const CustomHyperlink: React.FC<CustomHyperlinkProps> = ({ href, label, onClick, className }) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (onClick) {
        event.preventDefault();
        onClick();
      }
    };
  
    return (
      <a href={href} onClick={handleClick} className={`custom-hyperlink ${className}`}>
        {label}
      </a>
    );
  };

export default CustomHyperlink;