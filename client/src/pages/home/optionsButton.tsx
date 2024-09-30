import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu } from '@mui/material';
import { Button } from '@mui/base';

const OptionsButton = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const buttonClassName = `
    px-2 rounded-lg text-white font-bold text-xl bg-green-300 border-4 border-green-500
    hover:scale-110 transition ease-in-out active:brightness-75 flex justify-center items-center
  `;

  const MenuButton = ({ text, onClick }: { text: string, onClick: () => void }) => (
    <Button
      className={`${buttonClassName} my-0.5`}
      onClick={() => {
        setAnchorEl(null);
        onClick();
      }}
    >{text}</Button>
  );
  
  return (
    <div>
      <Button
        className={`${buttonClassName} m-1`}
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        &#8801;
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        sx={{
          '& .MuiPaper-root': {
            backgroundColor: 'transparent',
            boxShadow: 'none',
            overflow: 'visible',
          },
          '& .MuiMenu-list': {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end',
          },
        }}
      >
        <MenuButton text="Register" onClick={() => navigate('/register')} />
        <MenuButton text="Login" onClick={() => navigate('/login')} />
      </Menu>
    </div>
  );
};

export default OptionsButton;