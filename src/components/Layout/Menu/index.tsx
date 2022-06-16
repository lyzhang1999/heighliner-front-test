import React, {useContext, useState} from "react";
import clsx from 'clsx';

import styles from './index.module.scss';
import {getOrganizationNameByUrl, isBrowser} from "@/utils/utils";
import {Context} from "@/utils/store";
import MenuItem from "@/components/Layout/Menu/MenuItem";

const menuList = [
  {
    activeIcon: "/img/slider/homeActive.svg",
    icon: "/img/slider/home.svg",
    href: `/${getOrganizationNameByUrl()}/applications`,
    name: "Applications",
  },
  {
    activeIcon: "/img/slider/icon5Active.svg",
    icon: "/img/slider/icon5.svg",
    href: `/${getOrganizationNameByUrl()}/clusters`,
    name: "Clusters",
  },
  {
    activeIcon: "/img/slider/icon6Active.svg",
    icon: "/img/slider/icon6.svg",
    href: `/${getOrganizationNameByUrl()}/gitProvider`,
    name: "Git Provider",
  },
  {
    activeIcon: "/img/slider/icon7Active.svg",
    icon: "/img/slider/icon7.svg",
    href: `/${getOrganizationNameByUrl()}/teams`,
    name: "Teams",
  },
];

const bottomList = [
  {
    activeIcon: "/img/slider/icon7Active.svg",
    icon: "/img/slider/icon7.svg",
    href: `/settings`,
    name: "Settings",
  },
  {
    activeIcon: "/img/slider/homeActive.svg",
    icon: "/img/slider/home.svg",
    href: `/organizations`,
    name: "Organizations",
  },
  {
    activeIcon: "/img/slider/icon5Active.svg",
    icon: "/img/slider/icon5.svg",
    href: `/logout`,
    name: "Logout",
  },
];

function isActiveNav(currentPath: string) {
  if (isBrowser()) {
    return (location.href as string).includes(currentPath);
  } else {
    return false;
  }
}

const Menu = () => {
  const {state: {menuSpread}, dispatch} = useContext(Context);

  function setSpread() {
    dispatch({menuSpread: !menuSpread})
  }

  return (
    <div className={clsx(styles.menu, menuSpread && styles.spreadMenu)}>
      <div className={styles.logoWrapper} onClick={setSpread}>
        <img src="/img/logo/sliderlogo.png" alt="logo" className={styles.logo}/>
      </div>
      <div className={styles.menuList}>
        <MenuItem
          list={menuList}
        />

        <MenuItem
          list={bottomList}
        />
      </div>
    </div>
  )
}

export default Menu;
