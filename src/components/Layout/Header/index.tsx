import * as React from 'react';

import {MenuItem, Button, Menu} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import DashboardIcon from '@mui/icons-material/Dashboard';

import styles from './index.module.scss';

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div className={styles.header}>
      <div className={styles.headerWrapper}>
        <div className={styles.left}>
          <img src="/img/logo/header-logo.webp" alt="logo" className={styles.logo}/>
          <span className={styles.companyName}>Heighliner</span>
        </div>
        <div className={styles.right}>
          <Button
            color="inherit"
            startIcon={<DashboardIcon color="primary"/>}
          >
            Dashboard
          </Button>
          <Button
            color="inherit"
            id="basic-button"
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}
            startIcon={<PersonIcon color="primary"/>}
          >
            Account
          </Button>
          <Menu
            id="basic-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            <MenuItem onClick={handleClose}>Profile</MenuItem>
            <MenuItem onClick={handleClose}>Organizations</MenuItem>
            <MenuItem onClick={handleClose}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

