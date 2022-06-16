import React, {useContext, useState} from "react";
import clsx from 'clsx';

import styles from './index.module.scss';
import {getOrganizationNameByUrl, isBrowser} from "@/utils/utils";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import {Popover, Typography} from '@mui/material';
import {useRouter} from "next/router";
import {Context} from "@/utils/store";

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

function isActiveNav(currentPath: string) {
  if (isBrowser()) {
    return (location.href as string).includes(currentPath);
  } else {
    return false;
  }
}

const Menu = () => {
  const {state: {menuSpread}, dispatch} = useContext(Context);
  const router = useRouter();

  function setSpread() {
    dispatch({menuSpread: !menuSpread})
  }

  return (
    <div className={clsx(styles.menu, menuSpread && styles.spreadMenu)}>
      <div className={styles.logWrapper} onClick={setSpread}>
        <img src="/img/logo/sliderlogo.png" alt="logo" className={styles.logo}/>
      </div>
      <div className={styles.menuList}>
        <div className={styles.topMenu}>
          {
            menuList.map((item, index) => {
              let isActive = (isActiveNav(item.href));
              return (
                <div className={clsx(
                  styles.menuItem,
                  isActive && styles.activeMenu,
                  menuSpread && styles.spreadMenu
                )}
                     key={item.name}
                     onClick={() => router.push(item.href)}
                >
                  <div className={styles.iconWrapper}>
                    <img src={isActive ? item.activeIcon : item.icon} alt="" className={styles.menuIcon}/>
                    {
                      menuSpread &&
                      <div className={styles.spreadName}>
                        {item.name}
                      </div>
                    }
                  </div>

                  {
                    !menuSpread &&
                    <div className={styles.nameWrapper}>
                      <div className={styles.nameList}>
                        <div className={styles.nameItem}  onClick={() => router.push(item.href)}>
                          {item.name}
                        </div>
                      </div>
                    </div>
                  }
                </div>
              )
            })
          }
        </div>
      </div>

    </div>
  )
}

export default Menu;
