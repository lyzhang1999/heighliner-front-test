import styles from './index.module.scss';
import clsx from "clsx";
import React, {useContext} from "react";
import {Context} from "@/utils/store";
import {useRouter} from "next/router";
import {isBrowser} from "@/utils/utils";
import cookie from "@/utils/cookie";
import Pop from "@/components/Layout/Menu/Pop";

function isActiveNav(currentPath: string) {
  if (isBrowser()) {
    return (location.href as string).includes(currentPath);
  } else {
    return false;
  }
}

interface MenuProps {
  activeIcon: string,
  icon: string,
  href: string,
  name: string,
  isLogout?: boolean
}

export default function MenuItem({list}: { list: MenuProps[] }) {

  const {state: {menuSpread}} = useContext(Context);
  const router = useRouter();

  function handleClick(isLogout: boolean | undefined, href: string, isPop: boolean | undefined) {
    if (isLogout) {
      if (isPop) {
        cookie.delCookie('token');
        router.push('/login');
      }
    } else {
      router.push(href)
    }
  }

  return (
    <div>
      {
        list.map((item, index) => {
          let isActive = isActiveNav(item.href);
          return (
            <div className={clsx(
              styles.menuItem,
              isActive && styles.activeMenu,
              menuSpread && styles.spreadMenuItem
            )}
                 key={item.name}
                 onClick={() => handleClick(item.isLogout, item.href, false)}
            >
              <div className={clsx(styles.iconWrapper, item.isLogout,)}>
                <img src={isActive ? item.activeIcon : item.icon} alt="" className={styles.menuIcon}/>
                {
                  menuSpread && !item.isLogout &&
                  <div className={styles.spreadName}>
                    {item.name}
                  </div>
                }
              </div>
              {
                (!menuSpread || item.isLogout) &&
                <Pop cb={() => handleClick(item.isLogout, item.href, true)}>{item.name}</Pop>
              }
            </div>
          )
        })
      }
    </div>
  )
}
