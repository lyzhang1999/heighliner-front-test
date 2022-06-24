/**
 * Page center component: Vertically and horizontally centered position in the page
 */

import { CommonProps } from "@/utils/commonType";
import React from "react";

import styles from "./index.module.scss";

interface Props extends CommonProps {}

export default function PageCenter(props: Props) {
  return <div className={styles.blankPage}>{props.children}</div>;
}
