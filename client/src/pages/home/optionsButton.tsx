import { Menu, MenuItem, Button } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const OptionsButton = () => {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  return (
    <div>
      <Button
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        Settings
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={() => setAnchorEl(null)}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem onClick={() => {
          setAnchorEl(null);
          navigate('/register');
        }}>Register</MenuItem>

        <MenuItem onClick={() => {
          setAnchorEl(null);
          navigate('/login');
        }}>Login</MenuItem>
      </Menu>
    </div>
  );
};

export default OptionsButton;