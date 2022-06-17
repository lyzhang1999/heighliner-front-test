import React, {useContext, useEffect, useState} from "react";
import clsx from 'clsx';

import styles from './index.module.scss';
import {getOrganizationNameByUrl, getOriIdByContext, isBrowser} from "@/utils/utils";
import {Context} from "@/utils/store";
import MenuItem from "@/components/Layout/Menu/MenuItem";
import {Select, SelectChangeEvent, MenuItem as SelectMenuItem} from "@mui/material";
import {OrgList} from "@/utils/api/org";
import {find} from "lodash-es";

const menuList = [
  // {
  //   activeIcon: "/img/slider/homeActive.svg",
  //   icon: "/img/slider/home.svg",
  //   href: `/${getOrganizationNameByUrl()}/home`,
  //   name: "Home",
  // },
  {
    activeIcon: "/img/slider/icon2Active.svg",
    icon: "/img/slider/icon2.svg",
    href: `/${getOrganizationNameByUrl()}/applications`,
    name: "Applications",
  },
  {
    activeIcon: "/img/slider/icon3Active.svg",
    icon: "/img/slider/icon3.svg",
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
  // {
  //   activeIcon: "/img/slider/icon7Active.svg",
  //   icon: "/img/slider/icon7.svg",
  //   href: `/organizations`,
  //   name: "Help",
  // },
  {
    activeIcon: "/img/slider/homeActive.svg",
    icon: "/img/slider/home.svg",
    href: `/organizations`,
    name: "Organizations",
  },
  {
    activeIcon: "/img/slider/icon5Active.svg",
    icon: "/img/slider/icon5.svg",
    href: `/settings`,
    name: "Profile",
  },
  {
    activeIcon: "/img/slider/icon9.svg",
    icon: "/img/slider/icon9.svg",
    href: `/logout`,
    name: "Logout",
    isLogout: true,
  },
];

function isActiveNav(currentPath: string) {
  if (isBrowser()) {
    return (location.href as string).includes(currentPath);
  } else {
    return false;
  }
}

let defaultVal: null | string = null;


const Menu = () => {
  const [currentOrg, setCurrentOrg] = useState<number>(-1);
  const {state, dispatch} = useContext(Context);
  const {organizationList, menuSpread, currentOrganization} = state;

  useEffect(() => {
    let current = find(organizationList, {name: getOrganizationNameByUrl()})
    if (current) {
      setCurrentOrg(current.id);
    }
  }, [currentOrganization, organizationList])


  function setSpread() {
    dispatch({menuSpread: !menuSpread})
  }

  const handleChange = (event: SelectChangeEvent) => {
    let selectItem = find(organizationList, {id: event.target.value});
    if (selectItem) {
      let {name} = selectItem;
      let path = location.pathname.split("/")[2];
      location.pathname = `/${encodeURIComponent(name)}/${path}`;
    }
  };

  return (
    <div className={clsx(styles.menu, menuSpread && styles.spreadMenu)}>
      <div className={styles.logoWrapper}>
        <div className={styles.logo}>
          <img src="/img/logo/sliderlogo.png" alt="logo"/>
        </div>
        {
          menuSpread &&
          <div className={styles.changeOrg}>
            <Select
              onChange={handleChange}
              sx={{
                width: "160px",
                height: "40px",
                // fontSize: "14px",
                color: "#212d40",
                // fontWeight: "300",
                // lineHight: "40px",
                marginLeft: "6px"
              }}
              // variant="standard"
              // defaultValue={defaultVal}
              value={currentOrganization?.org_id}
            >
              {(organizationList as OrgList[]).map((item) => {
                return (
                  <SelectMenuItem
                    value={item.id}
                    key={item.id}
                    // sx={{fontSize: "14px", color: "#121226", fontWeight: "300"}}
                  >
                    {item.name}
                  </SelectMenuItem>
                );
              })}
            </Select>
          </div>
        }
      </div>
      <div className={styles.menuList}>
        <MenuItem
          list={menuList}
        />
        <MenuItem
          list={bottomList}
        />
      </div>
      {/*{*/}
      {/*  !menuSpread && <div className={styles.spreadAction}>*/}
      {/*    <img src="/img/slider/icon2.svg" alt="" onClick={setSpread}/>*/}
      {/*  </div>*/}
      {/*}*/}

      {/*<div className={styles.userInfo}>*/}
      {/*  <div className={styles.left}>*/}
      {/*    <img src="/img/slider/icon9.svg" alt=""/>*/}
      {/*  </div>*/}
      {/*  {*/}
      {/*    menuSpread && <div className={styles.right}>*/}
      {/*      <img src="/img/slider/spreadRight.svg" alt=""/>*/}
      {/*    </div>*/}
      {/*  }*/}
      {/*</div>*/}

      {

        <div className={clsx(styles.spreadAction, menuSpread && styles.remote)}>
          {/*<img src={!menuSpread ? "/img/slider/spreadLeft.svg" : "/img/slider/spreadRight.svg"} alt=""*/}
          {/*     onClick={setSpread}/>*/}
          <img src={"/img/slider/spreadLeft.svg"} alt=""
               onClick={setSpread}/>
        </div>
      }
    </div>
  )
}

export default Menu;
