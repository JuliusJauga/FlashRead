import React from 'react';

interface CustomHyperlinkProps {
  href: string;
  label: string;
  onClick?: () => void;
  className?: string;
}

const CustomHyperlink: React.FC<CustomHyperlinkProps> = ({ href, label, onClick, className }) => {
  return (
    <a href={href} onClick={onClick} className={`custom-hyperlink ${className}`}>
      {label}
    </a>
  );
};

export default CustomHyperlink;