import { Box, Stack } from "@mui/material";
import React from "react";
import Image from "next/image";
import clsx from "clsx";

import MultiShape from "/public/img/application/panel/multiShape.svg";
import Search from "/public/img/application/panel/search.svg";
import Edit from "/public/img/application/panel/edit.svg";
import Stats from "/public/img/application/panel/stats.svg";
import WWW from "/public/img/application/panel/www.svg";
import Set from "/public/img/application/panel/set.svg";
import { GetAppEnvironmentsRes } from "@/utils/api/application";

import styles from "./index.module.scss";

interface Props {
  resource: GetAppEnvironmentsRes[number]["resources"][number];
}

export default function DebugBox({ resource }: Props): React.ReactElement {
  return (
    <Stack justifyContent="center">
      <Box className={styles.box}>
        <Indicators total={resource.total} readyTotal={resource.ready_total} />
        {/* <div className={styles.lines}>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
          <div className={styles.line}></div>
        </div> */}
        <div className={styles.appName}>
          <MultiShape />
          <div className={styles.name}>{resource.name}</div>
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

function Indicators({ total, readyTotal }: { [index: string]: number }) {
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
