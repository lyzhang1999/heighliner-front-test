import * as React from 'react';
import {useRouter} from "next/router";

import {MenuItem, Button, Menu} from "@mui/material";
import PersonIcon from '@mui/icons-material/Person';
import cookie from "@/utils/cookie";

import styles from './index.module.scss';
import { getOrganizationByUrl } from '@/utils/utils';

export default function MenuAppBar() {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const router = useRouter();
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  }

  const handleLogout = () => {
    cookie.delCookie('token');
    router.push('/login');
  };

  return (
    <div className={styles.header}>
      <div className={styles.headerWrapper}>
        <div className={styles.left}>
          <img src="/img/logo/header-logo.webp" alt="logo" className={styles.logo}/>
          <span className={styles.companyName}>Heighliner</span>
        </div>
        <div className={styles.right}>
          {/*<Button*/}
          {/*  color="inherit"*/}
          {/*  startIcon={<DashboardIcon color="primary"/>}*/}
          {/*>*/}
          {/*  Dashboard*/}
          {/*</Button>*/}
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
            {/*<MenuItem onClick={handleClose}>Profile</MenuItem>*/}
            {/*<MenuItem onClick={handleClose}>Organizations</MenuItem>*/}
            <MenuItem onClick={() => router.push(`/settings`)}>Settings</MenuItem>
            <MenuItem onClick={handleLogout}>Logout</MenuItem>
          </Menu>
        </div>
      </div>
    </div>
  );
}

