/**
 * Global loading component, which will occupy the entire window.
 */

import React, { Dispatch, SetStateAction } from "react";
import { Backdrop } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";

interface Props extends CommonProps {
  openGlobalLoading: boolean;
  setOpenGlobalLoading: Dispatch<SetStateAction<boolean>>;
  title?: string;
  description?: string;
}

export default function GlobalLoading(props: Props): React.ReactElement {
  return (
    <Backdrop open={props.openGlobalLoading} className={styles.globalLoading}>
      <CircularProgress color="info" />
      {props.title && <p className={styles.title}>{props.title}</p>}
      {props.description && (
        <p className={styles.description}>{props.description}</p>
      )}
    </Backdrop>
  );
}
