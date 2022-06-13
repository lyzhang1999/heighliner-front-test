import * as React from "react";
import { MenuItem, Select, SelectChangeEvent } from "@mui/material";
import { Cloud } from "@mui/icons-material";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import clsx from "clsx";

import { getOriIdByContext, getOrganizationNameByUrl } from "@/utils/utils";

import styles from "./index.module.scss";
import { useContext, useState } from "react";
import { Context } from "@/utils/store";
import utils from "@/utils/utils";
import { useRouter } from "next/router";
import { OrgList } from "@/utils/api/org";
import { find } from "lodash-es";
import NestedMenu, { MenuList } from "@/basicComponents/NestedMenu";

// function getNavlist() {
//   return [
//     {
//       icon: <Cloud fontSize="small" />,
//       href: `/${getOrganizationNameByUrl()}/applications`,
//       name: "Applications",
//     },
//     {
//       icon: <AccountTreeIcon fontSize="small" />,
//       href: `/${getOrganizationNameByUrl()}/clusters`,
//       name: "Clusters",
//     },
//     {
//       icon: <AccountTreeIcon fontSize="small" />,
//       href: `/${getOrganizationNameByUrl()}/gitProvider`,
//       name: "Git Provider",
//     },
//     {
//       icon: <AccountTreeIcon fontSize="small" />,
//       href: `/${getOrganizationNameByUrl()}/teams`,
//       name: "Teams",
//     },
//   ];
// }

const menuList: MenuList = [
  {
    to: `/${getOrganizationNameByUrl()}/applications`,
    title: "Applications",
  },
  {
    title: "Global Config",
    items: [
      {
        to: `/${getOrganizationNameByUrl()}/clusters`,
        title: "Clusters",
      },
      {
        icon: <AccountTreeIcon fontSize="small" />,
        to: `/${getOrganizationNameByUrl()}/gitProvider`,
        title: "Git Provider",
      },
    ],
  },
];

// const buttonLinks: { [index: string]: string } = {
//   createApplication: `/${getOriIdByContext()}/applications/create`,
// };

// function isActiveNav(currentPath: string) {
//   if (utils.isBrowser()) {
//     return (location.href as string).includes(currentPath);
//   } else {
//     return false;
//   }
// }

let defaultVal: null | string = null;

const Slider = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const { state } = useContext(Context);
  // const router = useRouter();

  // close server render
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  const { organizationList } = state;

  const handleChange = (event: SelectChangeEvent) => {
    // if (getOriIdByContext() === Number(event.target.value)) {
    //   return;
    // }
    let selectItem = find(organizationList, { id: event.target.value });
    if (selectItem) {
      let { name } = selectItem;
      let path = location.pathname.split("/")[2];
      location.pathname = `/${encodeURIComponent(name)}/${path}`;
    }

    // setRenderContent(false);
    // router.push(`/${event.target.value}/${path}`);
    // setTimeout(() => {
    //   setRenderContent(true);
    // }, 100)
  };

  if (!defaultVal) {
    defaultVal = getOriIdByContext();
  }

  return (
    <div className={styles.slider}>
      <div className={styles.navTitle}>Organization</div>
      <Select
        onChange={handleChange}
        sx={{
          width: "100%",
          height: "40px",
          fontSize: "14px",
          color: "#121226",
          fontWeight: "300",
        }}
        defaultValue={defaultVal}
      >
        {(organizationList as OrgList[]).map((item) => {
          return (
            <MenuItem
              value={item.id}
              key={item.id}
              sx={{ fontSize: "14px", color: "#121226", fontWeight: "300" }}
            >
              {item.name}
            </MenuItem>
          );
        })}
      </Select>
      <div className={styles.navTitle}>Menu</div>
      <NestedMenu menuList={menuList} />
      {/* <div className={styles.menuList}>
        {getNavlist().map((item) => {
          let { href, name } = item;
          return (
            <div
              className={clsx(
                styles.menuItem,
                isActiveNav(href) && styles.activeMenu
              )}
              key={item.name}
              onClick={() => router.push(href)}
            >
              {name}
            </div>
          );
        })}
      </div> */}
    </div>
  );
};

export default Slider;
