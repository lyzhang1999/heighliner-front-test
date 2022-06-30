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

export interface PopProps extends CommonProps{
  item: PopItem[]
}

function PopSelect({item}: PopProps, ref: any) {
  const [anchorEl, setAnchorEl] = React.useState<SVGSVGElement | null>(null);
  React.useImperativeHandle(ref, () => ({
    setSelect: (dom: any) => {
      setAnchorEl(dom);
    }
  }));

  function handleClose() {
    setAnchorEl(null)
  }

  return (
    <Popover
      open={Boolean(anchorEl)}
      anchorEl={anchorEl}
      onClose={handleClose}
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

export default React.forwardRef(PopSelect);
