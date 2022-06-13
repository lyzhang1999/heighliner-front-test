import * as React from "react";
import { MenuItem, Select, SelectChangeEvent, Button } from "@mui/material";
import { Cloud } from "@mui/icons-material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import clsx from "clsx";

import { getOriIdByContext } from "@/utils/utils";

import styles from "./index.module.scss";
import { useContext } from "react";
import { Context } from "@/utils/store";
import utils from "@/utils/utils";
import { useRouter } from "next/router";
import { OrgList } from "@/utils/api/org";

function getNavlist() {
  return [
    {
      icon: <Cloud fontSize="small" />,
      href: `/settings`,
      name: "profile",
    },
  ];
}

const buttonLinks: { [index: string]: string } = {
  createApplication: `/${getOriIdByContext()}/applications/create`,
};

function isActiveNav(currentPath: string) {
  if (utils.isBrowser()) {
    return (location.href as string).includes(currentPath);
  } else {
    return false;
  }
}

export default function SettingSlider() {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { state } = useContext(Context);
  const router = useRouter();

  // close server render
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  const { organizationList } = state;

  const handleChange = (event: SelectChangeEvent) => {};
  const oriKey = getOriIdByContext();

  return (
    <div className={styles.slider}>
      <div className={styles.navTitle}>Menu</div>
      <div className={styles.menuList}>
        {getNavlist().map((item) => {
          let { href, name } = item;
          return (
            <div
              className={clsx(
                styles.memuItem,
                isActiveNav(href) && styles.activeMenu
              )}
              key={item.name}
              onClick={() => router.push(href)}
            >
              {name}
            </div>
          );
        })}
      </div>
    </div>
  );
}
