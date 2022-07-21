import React, { Dispatch, MouseEvent, SetStateAction, SyntheticEvent, useRef } from "react";
import { Drawer } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";

interface Props extends CommonProps {
  modalDisplay: boolean;
  setModalDisplay: Dispatch<SetStateAction<boolean>>;
  title?: string;
}

export default function RightDrawer(props: Props): React.ReactElement {
  const drawerEle = useRef(null);

  const handleClose = (event: MouseEvent) => {
    props.setModalDisplay(false);
    event.stopPropagation();
  };

  return (
    <Drawer
      anchor="right"
      open={props.modalDisplay}
      sx={{
        root: { borderTopLeftRadius: "14px", border: "1px solid black" },
      }}
    >
      <div className={styles.drawerWrap} ref={drawerEle}>
        <div className={styles.closeIcon} title="Close">
          <CloseIcon onClick={handleClose} />
        </div>
        {props.title && <div className={styles.header}>{props.title}</div>}
        {props.children}
      </div>
    </Drawer>
  );
}
