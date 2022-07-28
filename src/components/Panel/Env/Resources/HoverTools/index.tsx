import React from "react";
import clsx from "clsx";
import Image from "next/image";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";

interface Props extends CommonProps {}

export default function HoverTools() {
  return (
    <ul className={styles.wrapper}>
      {[
        "/img/application/panel/env/circle@3x.png",
        "/img/application/panel/env/circuit@3x.png",
        "/img/application/panel/env/debug@3x.png",
        "/img/application/panel/env/edit@3x.png",
        "/img/application/panel/env/setting@3x.png",
        "/img/application/panel/env/start@3x.png",
      ].map((url, index) => (
        <li key={index}>
          <Image src={url} layout="fill" objectFit="contain" alt="" />
        </li>
      ))}
    </ul>
  );
}
