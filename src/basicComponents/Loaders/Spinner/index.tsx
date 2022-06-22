/**
 * Code from https://loading.io/css/
 */

import React from "react";

import styles from "./index.module.scss";

interface Props {
  spinnerColor?: string;
  scale?: number | string;
}

export default function Spinner({ spinnerColor, scale }: Props): React.ReactElement {
  return (
    <div className={styles.ldsSpinner} style={{transform: `scale(${scale})`}}>
      {new Array(12).fill("").map((_, index) => (
        <div key={index} style={{ backgroundColor: spinnerColor }}
        ></div>
      ))}
    </div>
  );
}
