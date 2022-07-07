import styles from './index.module.scss'
import clsx from "clsx";
import * as React from "react";
import {Popover} from "@mui/material";
import {CommonProps} from "@/utils/commonType";

export interface PopItem {
  key: string;
  clickCb: () => void;
  red?: boolean;
};

export interface PopProps extends CommonProps {
  item: PopItem[],
  mountDom: Element | null,
  setMountDom: (dom: (Element | null)) => void
}

export default function PopSelect({item, mountDom, setMountDom}: PopProps) {
  return (
    <Popover
      open={Boolean(mountDom)}
      anchorEl={mountDom}
      onClose={() => setMountDom(null)}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left',
      }}
    >
      <div className={styles.selectWrapper}>
        {item.map(i => (
          <div className={clsx(styles.selectItem, i.red && styles.redItem)}
               key={i.key}
               onClick={i.clickCb}
          >{i.key}</div>
        ))}
      </div>
    </Popover>
  )
}
