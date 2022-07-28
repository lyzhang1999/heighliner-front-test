import React from "react";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";
import Indicators from "@/basicComponents/Indicators";

interface Props extends CommonProps {
  name: string;
  ready_replicas: number;
  replicas: number;
}

export default function Resource(props: Props): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <h1>{props.name}</h1>
      <Indicators
        {...{
          total: props.replicas,
          readyTotal: props.ready_replicas,
        }}
      />
      {props.children}
    </div>
  );
}
