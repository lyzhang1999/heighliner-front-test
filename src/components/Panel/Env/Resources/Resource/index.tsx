import React from "react";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";
import Indicators from "@/basicComponents/Indicators";
import { Typography } from "@mui/material";

interface Props extends CommonProps {
  name: string;
  ready_replicas: number;
  replicas: number;
}

export default function Resource(props: Props): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <h1>{props.name}</h1>
      <div className={styles.status}>
        <Typography>Status:</Typography>
        <Indicators
          {...{
            total: props.replicas,
            readyTotal: props.ready_replicas,
          }}
        />
      </div>
      {props.children}
    </div>
  );
}
