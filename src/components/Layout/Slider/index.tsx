import * as React from 'react';

import {ListItemIcon, ListItemText, MenuItem, MenuList, Paper, Select, SelectChangeEvent, Button} from "@mui/material";
import {Cloud, ContentCopy, ContentCut, ContentPaste} from "@mui/icons-material";

import styles from "./index.module.scss";

const buttonOneStyle = {
  width: "100%",
  marginTop: "30px"
}

const buttonSecondStyle = {
  width: "100%",
  marginTop: "10px"
}

const MenuItemStyle = {
  margin: '10px 0',

}

const Slider = () => {
  const [age, setAge] = React.useState('');
  const handleChange = (event: SelectChangeEvent) => {
    setAge(event.target.value);
  };

  return (
    <div className={styles.slider}>
      <div className={styles.title}>
        Organization
      </div>
      <Select
        onChange={handleChange}
        sx={{width: "100%", height: '40px'}}
      >
        <MenuItem value={10}>Twenty</MenuItem>
        <MenuItem value={21}>Twenty one</MenuItem>
        <MenuItem value={22}>Twenty two</MenuItem>
      </Select>
      <Button
        variant="contained"
        sx={buttonOneStyle}
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
        <MenuItem sx={MenuItemStyle}>
          <ListItemIcon>
            <ContentCut fontSize="small"/>
          </ListItemIcon>
          <ListItemText>One</ListItemText>
        </MenuItem>
        <MenuItem sx={MenuItemStyle}>
          <ListItemIcon>
            <ContentCopy fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Two</ListItemText>
        </MenuItem>
        <MenuItem sx={MenuItemStyle}>
          <ListItemIcon>
            <ContentPaste fontSize="small"/>
          </ListItemIcon>
          <ListItemText>three</ListItemText>
        </MenuItem>
        <MenuItem sx={MenuItemStyle}>
          <ListItemIcon>
            <Cloud fontSize="small"/>
          </ListItemIcon>
          <ListItemText>Four</ListItemText>
        </MenuItem>
      </MenuList>
    </div>
  )
};


export default Slider;
