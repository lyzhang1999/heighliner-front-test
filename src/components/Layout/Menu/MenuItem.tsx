import styles from './index.module.scss';
import clsx from "clsx";
import React, {useContext} from "react";
import {Context} from "@/utils/store";
import {useRouter} from "next/router";
import {isBrowser} from "@/utils/utils";
import Pop from "@/components/Layout/Menu/Pop";

function isActiveNav(currentPath: string) {
  if (isBrowser()) {
    return (location.href as string).includes(currentPath);
  } else {
    return false;
  }
}

export type MenuItem = {
  activeIcon: string,
  icon: string,
  href: string,
  name: string,
  openLink?: string
}

export type MenuList = MenuItem[];

interface Props {
  list: MenuList;
}

export default function MenuItem({list}: Props) {

  const {state: {menuSpread}} = useContext(Context);
  const router = useRouter();

  function handleClick(item: MenuItem) {
    let {href, openLink} = item;
    if (openLink) {
      window.open(openLink);
    } else {
      router.push(href);
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
                 onClick={() => handleClick(item)}
            >
              <div className={clsx(styles.iconWrapper,)}>
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
                <Pop cb={() => handleClick(item)}>{item.name}</Pop>
              }
            </div>
          )
        })
      }
    </div>
  )
}
