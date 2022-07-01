import styles from "./index.module.scss";
import React, {ReactNode} from "react";

export default function Pop({children, cb}: { children: ReactNode, cb: () => void }) {
  return (
    <div className={styles.nameWrapper}>
      <div className={styles.nameList}>
        <div className={styles.nameItem}
             onClick={cb}
        >
          {children}
        </div>
      </div>
    </div>
  )
}
