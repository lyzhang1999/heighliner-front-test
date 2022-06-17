import { Box, Stack } from "@mui/material";
import React from "react";
import Image from "next/image";

import MultiShape from "/public/img/application/panel/multiShape.svg";
import Search from "/public/img/application/panel/search.svg";
import Edit from "/public/img/application/panel/edit.svg";
import Stats from "/public/img/application/panel/stats.svg";
import WWW from "/public/img/application/panel/www.svg";
import Set from "/public/img/application/panel/set.svg";

import styles from "./index.module.scss";

export default function DebugBox(): React.ReactElement {
  return (
    <Stack justifyContent="center">
      <Box className={styles.box}>
        <div className={styles.lines}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div>
        <div className={styles.appName}>
          <MultiShape />
          <div className={styles.name}>My-Shop-Backend</div>
        </div>
        <div className={styles.debug}>
          <Image
            src="/img/application/panel/vscode@3x.png"
            alt=""
            width={18.6}
            height={20}
          />
          <div className={styles.name}>Debug</div>
        </div>
        <div className={styles.operateGroup}>
          <Search />
          <Edit />
          <Stats />
          <WWW />
          <Set />
        </div>
      </Box>
    </Stack>
  );
}
