import React from 'react';

const ModeButton: React.FC<{
  label: string;
  onClick: () => void;
}> = ({ label, onClick }) => {
  return (
    <button
      className={`
        w-[8rem] h-[8rem] rounded-lg text-white font-bold text-xl bg-green-300 border-4 border-green-500
        hover:scale-110 transition ease-in-out active:brightness-75
        `}
      onClick={onClick}
    >
      {label}
    </button>
  );
};

export default ModeButton;
