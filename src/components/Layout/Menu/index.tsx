import React, {useContext, useState} from "react";
import clsx from 'clsx';

import styles from './index.module.scss';
import {Context} from "@/utils/store";
import MenuItem, {MenuList} from "@/components/Layout/Menu/MenuItem";
import {Select, SelectChangeEvent, MenuItem as SelectMenuItem} from "@mui/material";
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import {OrgList} from "@/api/org";
import {find} from "lodash-es";
import {useRouter} from "next/router";
import {get} from 'lodash-es';
import {getOriNameByContext, uuid} from "@/utils/utils";
import Identicon, {IdenticonOptions} from 'identicon.js';
import md5 from 'md5';

const NEWORGANIZATION = "NEWORGANIZATION" + uuid();

const Menu = () => {
  const [open, setOpen] = useState(false);
  const {state, dispatch} = useContext(Context);
  const {organizationList, menuSpread, currentOrganization, userInfo} = state;
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
    if (NEWORGANIZATION === event.target.value) {
      router.push('/organizations?new=true')
      return;
    }
    let selectItem = find(organizationList, {id: event.target.value});
    if (selectItem) {
      let name = get(selectItem, 'name');
      name && (location.pathname = `/${encodeURIComponent(name)}/applications`);
    }
  };

  let name = encodeURIComponent(get(currentOrganization, 'name', ''));

  function goHome() {
    router.push(`/${encodeURIComponent(getOriNameByContext())}/applications`)
  }

  const menuList: MenuList = [
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
      activeIcon: "/img/slider/icon7Active.svg",
      icon: "/img/slider/icon7.svg",
      href: `/${name}/members`,
      name: "Members",
    },
  ];
  let avatar = get(userInfo, 'avatar', '');

  function getAvatar(balckBack?: boolean) {
    if (avatar) {
      return avatar;
    } else {
      let userId: number = get(userInfo, 'id', 0)
      let hash: string = md5(String(userId));
      let options: IdenticonOptions = {
        foreground: [205, 203, 235, 255],
        background: balckBack ? [0, 0, 0, 255] : [255, 255, 255, 255],
        size: 20,
        format: 'svg'
      };
      const imgData = new Identicon(hash, options).toString();
      return `data:image/svg+xml;base64,${imgData}`
    }
  }

  const bottomList: MenuList = [
    {
      activeIcon: "/img/slider/icon6Active.svg",
      icon: "/img/slider/icon6.svg",
      href: `/gitProvider`,
      name: "Git Provider",
    },
    {
      activeIcon: "/img/slider/icon10Active.svg",
      icon: "/img/slider/icon10.svg",
      href: `/organizations`,
      name: "Organizations",
    },
    {
      activeIcon: getAvatar(true),
      icon: getAvatar(),
      href: `/profile`,
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
              value={String(currentOrganization?.org_id)}
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
                value={NEWORGANIZATION}
                key={NEWORGANIZATION}
              >
                {/*<AddCircleOutlineOutlinedIcon/>*/}
                <span style={{color: "#1b51b9"}}>NEW ORGANIZATION</span>
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
      <div className={clsx(styles.spreadAction)} onClick={setSpread}>
        <img src={!menuSpread ? "/img/slider/spreadLeft.svg" : "/img/slider/spreadRight.svg"} alt=""
        />
      </div>
    </div>
  )
}

export default Menu;
