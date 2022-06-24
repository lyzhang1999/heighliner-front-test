import React, {useContext, useState} from "react";
import clsx from 'clsx';

import styles from './index.module.scss';
import {Context} from "@/utils/store";
import MenuItem from "@/components/Layout/Menu/MenuItem";
import {Select, SelectChangeEvent, MenuItem as SelectMenuItem} from "@mui/material";
import {OrgList} from "@/utils/api/org";
import {find} from "lodash-es";
import cookie from "@/utils/cookie";
import {useRouter} from "next/router";
import {get} from 'lodash-es';
import {getOriNameByContext} from "@/utils/utils";
import Pop from "@/components/Layout/Menu/Pop";

const Menu = () => {
  const [open, setOpen] = useState(false);
  const {state, dispatch} = useContext(Context);
  const {organizationList, menuSpread, currentOrganization} = state;
  const router = useRouter();

  function setSpread() {
    dispatch({menuSpread: !menuSpread, setSpreadFlag: true})
  }

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleChange = (event: SelectChangeEvent) => {
    if ("NEWORGANIZATION" === event.target.value) {
      router.push('/organizations?new=true')
      return;
    }
    let selectItem = find(organizationList, {id: event.target.value});
    if (selectItem) {
      let name = get(selectItem, 'name');
      // dispatch({currentOrganization: omit({...selectItem, ...selectItem.member}, 'member')})
      // router.push(`/${encodeURIComponent(name)}/applications`);
      name && (location.pathname = `/${encodeURIComponent(name)}/applications`);
    }
  };

  function logout() {
    cookie.delCookie('token');
    router.push('/login');
  }

  let name = get(currentOrganization, 'name', '');

  function goHome() {
    router.push(`/${getOriNameByContext()}/applications`)
  }

  const menuList = [
    // {
    //   activeIcon: "/img/slider/homeActive.svg",
    //   icon: "/img/slider/home.svg",
    //   href: `/${name}/home`,
    //   name: "Home",
    // },
    {
      activeIcon: "/img/slider/icon2Active.svg",
      icon: "/img/slider/icon2.svg",
      href: `/${name}/applications`,
      name: "Applications",
    },
    {
      activeIcon: "/img/slider/icon3Active.svg",
      icon: "/img/slider/icon3.svg",
      href: `/${name}/clusters`,
      name: "Clusters",
    },
    {
      activeIcon: "/img/slider/icon6Active.svg",
      icon: "/img/slider/icon6.svg",
      href: `/${name}/gitProvider`,
      name: "Git Provider",
    },
    {
      activeIcon: "/img/slider/icon7Active.svg",
      icon: "/img/slider/icon7.svg",
      href: `/${name}/teams`,
      name: "Teams",
    },
  ];

  const bottomList = [
    {
      activeIcon: "/img/slider/icon10Active.svg",
      icon: "/img/slider/icon10.svg",
      href: `/organizations`,
      name: "Organizations",
    },
    {
      activeIcon: "/img/slider/icon11Active.svg",
      icon: "/img/slider/icon11.svg",
      href: `/settings`,
      name: "Profile",
    },
  ];

  return (
    <div className={clsx(styles.menu, menuSpread && styles.spreadMenu)}>
      <div className={styles.logoWrapper}>
        <div className={styles.logo} onClick={goHome}>
          <img src="/img/logo/sliderlogo.png" alt="logo"/>
        </div>
        {
          menuSpread &&
          <div className={styles.changeOrg}>
            <Select
              onChange={handleChange}
              open={open}
              onClose={handleClose}
              onOpen={handleOpen}
              sx={{
                width: "160px",
                height: "40px",
                fontSize: "14px",
                color: "#212d40",
                marginLeft: "6px"
              }}
              // @ts-ignore
              value={Number(currentOrganization?.org_id)}
            >

              {(organizationList as OrgList[]).map((item) => {
                return (
                  <SelectMenuItem
                    value={item.id}
                    key={item.id}
                  >
                    {item.name}
                  </SelectMenuItem>
                );
              })}
              <SelectMenuItem
                value="NEWORGANIZATION"
                key='NEWORGANIZATION'
              >
                Create A Organization
              </SelectMenuItem>
            </Select>
            <div className={clsx(styles.selectIcon)} onClick={handleOpen}>
              <img src="/img/slider/selcetIcon.webp" alt="" className={open ? styles.rotate : ''}/>
            </div>
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
      <div className={
        clsx(
          styles.userInfo,
          !menuSpread && styles.userInfoHidden
        )

      }>
        <div className={styles.left}>
          <img src="/img/slider/icon9.svg" alt=""/>
          {
            !menuSpread &&
            <Pop cb={logout}>Logout</Pop>
          }
        </div>
        {
          menuSpread &&
          <div className={styles.right}>
            {get(state, 'userInfo.username', '')}
            <Pop cb={logout}>Logout</Pop>
          </div>
        }
      </div>
      <div className={clsx(styles.spreadAction)} onClick={setSpread}>
        <img src={!menuSpread ? "/img/slider/spreadLeft.svg" : "/img/slider/spreadRight.svg"} alt=""
        />
      </div>
    </div>
  )
}

export default Menu;
