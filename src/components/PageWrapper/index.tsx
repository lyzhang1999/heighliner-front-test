import styles from './index.module.scss';
import {ReactNode} from "react";

interface Props {
  title: string,
  desc?: string,
  btnDesc?: string,
  btnCb?: () => void,
  children?: ReactNode
}

export default function PageWrapper({title, desc, btnDesc, btnCb, children}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.iconWrapper}>
        <img src={"/img/logo/logo.webp"} alt=""/>
      </div>
      <div className={styles.title}>{title}</div>
      {
        desc && <div className={styles.desc}>{desc}</div>
      }
      {children}
      {
        btnDesc && <div className={styles.btn} onClick={btnCb}>
          {btnDesc}
        </div>
      }
    </div>
  )
}

