import React from "react";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";

interface Props extends CommonProps {
  total: number;
  readyTotal: number;
}

export default function Indicators({ total, readyTotal }: Props) {
  return (
    <div className={styles.lines}>
      {/* ready line */}
      {new Array(readyTotal).fill("").map((_, index) => (
        <div className={styles.line} key={"readyTotal" + index}></div>
      ))}
      {/* no ready line */}
      {new Array(total - readyTotal).fill("").map((_, index) => (
        <div
          className={clsx(styles.line, styles.noReady)}
          key={"noReadyTotal" + index}
        ></div>
      ))}
    </div>
  );
}
