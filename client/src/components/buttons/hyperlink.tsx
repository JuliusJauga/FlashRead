import React from 'react';
import "./hyperlink.css";

interface CustomHyperlinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
  id?: string;
}

const CustomHyperlink: React.FC<CustomHyperlinkProps> = ({ href, label, className, id, onClick }) => {
    const handleClick = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      if (onClick) {
        event.preventDefault();
        onClick();
      }
    };
  
    return (
      <a href={href} onClick={handleClick} className={className} id={id}>
        {label}
      </a>
    );
  };

export default CustomHyperlink;