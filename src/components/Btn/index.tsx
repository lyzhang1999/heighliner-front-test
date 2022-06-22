import styles from './index.module.scss';
import React from "react";
import clsx from "clsx";

export enum BtnType {
  "gray" = "gray"
}

interface Props {
  children?: React.ReactNode,
  type?: BtnType,
  style?: React.CSSProperties
  onClick?: () => void
}

export default function Btn({children, type, style, onClick}: Props) {
  return (
    <span className={clsx(
      !type && styles.btn,
      (type === BtnType.gray) && styles.grayBtn
    )}
          style={style}
          onClick={onClick}>
      {children}
    </span>
  )
}
