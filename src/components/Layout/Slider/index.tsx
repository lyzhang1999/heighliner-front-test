import * as React from 'react';
import Link from 'next/link'
import {ListItemIcon, ListItemText, MenuItem, MenuList, Select, SelectChangeEvent, Button} from "@mui/material";
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

const menuItemStyle = {
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
        Organization:
      </div>
      <Select
        onChange={handleChange}
        sx={{width: "100%", height: '40px'}}
        defaultValue={"1"}
      >
        <MenuItem value={1}>Org one</MenuItem>
        <MenuItem value={2}>Org two</MenuItem>
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
        <Link href="/xxx/applications">
          <MenuItem sx={menuItemStyle}>
            <ListItemIcon>
              <ContentCut fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Applications</ListItemText>
          </MenuItem>
        </Link>
        <Link href="/xxx/clusters">
          <MenuItem sx={menuItemStyle}>
            <ListItemIcon>
              <ContentPaste fontSize="small"/>
            </ListItemIcon>
            <ListItemText>Clusters</ListItemText>
          </MenuItem>
        </Link>
      </MenuList>
    </div>
  )
};


export default Slider;
