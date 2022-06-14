/**
 * Menu has nested menu item.
 */

import React, {ReactElement} from "react";
import {
  Collapse,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {useRouter} from "next/router";
import clsx from "clsx";

import {isBrowser} from "@/utils/utils";
import styles from "./index.module.scss";

export interface Menu {
  icon?: ReactElement;
  title: string;
  to?: string;
  items?: Menu[];
}

export type MenuList = Menu[];

interface Props {
  menuList: MenuList;
}

function isActiveNav(currentPath: string) {
  if (isBrowser()) {
    return (location.href as string).includes(currentPath);
  } else {
    return false;
  }
}

export default function NestedMenu({menuList}: Props): React.ReactElement {
  const [open, setOpen] = React.useState(false);

  const router = useRouter();

  const expandSubmenu = () => {
    setOpen(!open);
  };

  return (
    <div className={styles.wrap}>
      {menuList.map((menu) => {
        // Have multiple sub-items, recursively invoke NestedMenu component. 
        if (menu.items && menu.items.length > 0) {
          return (
            <>
              <ListItemButton onClick={expandSubmenu}>
                <ListItemText primary={menu.title}/>
                {open ? <ExpandLess/> : <ExpandMore/>}
              </ListItemButton>
              <Collapse in={open} timeout="auto" unmountOnExit>
                <div className={styles.nestedMenu}>
                  <NestedMenu menuList={menu.items}/>
                </div>
              </Collapse>
            </>
          );
        } else {
          return (
            <ListItemButton
              key={menu.title}
              onClick={() => {
                router.push(menu.to!);
              }}
              className={clsx(isActiveNav(menu.to!) && styles.activeMenu)
              }
            >
              <ListItemText primary={menu.title}/>
            </ListItemButton>
          );
        }
      })}
    </div>
  );
}
