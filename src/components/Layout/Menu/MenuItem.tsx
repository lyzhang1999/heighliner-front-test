import styles from './index.module.scss';
import clsx from "clsx";
import React, {useContext} from "react";
import {Context} from "@/utils/store";
import {useRouter} from "next/router";
import {isBrowser} from "@/utils/utils";

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
}

export default function MenuItem({list}: { list: MenuProps[] }) {

  const {state: {menuSpread}, dispatch} = useContext(Context);
  const router = useRouter();

  function setSpread() {
    dispatch({menuSpread: !menuSpread})
  }

  return (
    <div>
      {
        list.map((item, index) => {
          let isActive = (isActiveNav(item.href));
          return (
            <div className={clsx(
              styles.menuItem,
              isActive && styles.activeMenu,
              menuSpread && styles.spreadMenuItem
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
                    <div className={styles.nameItem} onClick={() => router.push(item.href)}>
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
  )
}
