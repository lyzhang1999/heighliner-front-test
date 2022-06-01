import * as React from 'react';
import Link from 'next/link'
import {
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Select,
  SelectChangeEvent,
  Button,
} from "@mui/material";
import {Cloud} from "@mui/icons-material";
import AccountTreeIcon from '@mui/icons-material/AccountTree';

import {getOriginzationByUrl} from "@/utils/utils";

import styles from "./index.module.scss";
import {useContext} from "react";
import {Context} from "@/utils/store";
import utils from "@/utils/utils";
import { useRouter } from 'next/router';

const buttonOneStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "30px"
}

const buttonSecondStyle: React.CSSProperties = {
  width: "100%",
  marginTop: "10px"
}

const menuItemStyle: React.CSSProperties = {
  margin: '10px 0',
}

function getNavlist() {
  return [
    {
      icon: <Cloud fontSize="small"/>,
      href: `/${getOriginzationByUrl()}/applications`,
      name: "Applications"
    },
    {
      icon: <AccountTreeIcon fontSize="small"/>,
      href: `/${getOriginzationByUrl()}/clusters`,
      name: "Clusters"
    }
  ]
}

const buttonLinks: {[index: string]: string} = {
  createApplication: `/${getOriginzationByUrl()}/applications/create`
}

function isActiveNav(currentPath: string) {
  if (utils.isBrowser()) {
    return (location.href as string).includes(currentPath);
  } else {
    return false;
  }
}

const Slider = () => {
  const {state} = useContext(Context);
  const {organizationList} = state;
  const router = useRouter();

  const handleChange = (event: SelectChangeEvent) => {
  };
  const oriKey = getOriginzationByUrl();

  return (
    <div className={styles.slider}>
      <div className={styles.title}>
        Organization
      </div>
      <Select
        onChange={handleChange}
        sx={{width: "100%", height: '40px'}}
        defaultValue={oriKey}
      >
        {
          organizationList.map((item: typeof organizationList) => {
            return (
              <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
            )
          })
        }
      </Select>
      <Button
        variant="contained"
        sx={buttonOneStyle}
        onClick={() => {router.push(buttonLinks.createApplication)}}
      >
        Create Application
      </Button>
      <Button
        variant="outlined"
        sx={buttonSecondStyle}
      >
        Create Organization
      </Button>
      <MenuList>
        {
          getNavlist().map(item => {
            let {icon, href, name} = item;
            // let isSelected = isActiveNav(href)
            return (
              <Link href={href} key={name}>
                <MenuItem
                  selected={isActiveNav(href)}
                  sx={menuItemStyle}
                >
                  <ListItemIcon>
                    {icon}
                  </ListItemIcon>
                  <ListItemText>{name}</ListItemText>
                </MenuItem>
              </Link>
            )
          })
        }
      </MenuList>
    </div>
  )
};

export default Slider;
