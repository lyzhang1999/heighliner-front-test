import DitchTab, { TabItems } from "@/basicComponents/DitchTab";
import React, { useState } from "react";
import { Avatar, Box, Stack } from "@mui/material";
import clsx from "clsx";

import CodeSVG from "/public/img/application/panel/code.svg";
import InfiniteSVG from "/public/img/application/panel/infinite.svg";
import CloudSVG from "/public/img/application/panel/cloud.svg";
import Layout from "@/components/Layout";

import styles from "./index.module.scss";
import Image from "next/image";
import { GinIcon, SpringIcon, VueIcon } from "@/utils/CDN";

enum TabItemLabels {
  Code = "Code",
  Ship = "Ship",
  Run = "Run",
}

const tabItems: TabItems<keyof typeof TabItemLabels> = [
  {
    label: TabItemLabels.Code,
    icon: <CodeSVG fill="#404a59" />,
    selectedIcon: <CodeSVG fill="#FFFFFF" />,
  },
  {
    label: TabItemLabels.Ship,
    icon: <InfiniteSVG fill="#404a59" />,
    selectedIcon: <InfiniteSVG fill="#FFFFFF" />,
  },
  {
    label: TabItemLabels.Run,
    icon: <CloudSVG fill="#404a59" />,
    selectedIcon: <CloudSVG fill="#FFFFFF" />,
  },
];

const techSet = [GinIcon, VueIcon, SpringIcon];

export default function Panel(): React.ReactElement {
  const [selectedItem, setSelectedItem] = useState<keyof typeof TabItemLabels>(
    TabItemLabels.Code
  );

  return (
    <Layout>
      <Stack alignItems="center" className={styles.tabs}>
        <DitchTab<keyof typeof TabItemLabels>
          selectedItem={selectedItem}
          tabItems={tabItems}
          setSelectedItem={setSelectedItem}
        />
      </Stack>
      <Box className={styles.separator}></Box>
      <Stack direction="row" justifyContent="space-between">
        <Stack
          direction="row"
          justifyContent="flex-start"
          className={styles.appInfo}
        >
          <div className={styles.appAvatar}></div>
          <div className={styles.appName}>My Shop</div>
          <div className={styles.appStatus}>Running</div>
        </Stack>
        <Stack
          direction="row"
          justifyContent="flex-start"
          className={styles.appInfo}
        >
          {techSet.map((tech, index) => (
            <div className={styles.techIcon} key={index}>
              <Image
                src={tech}
                alt=""
                width={25}
                height={25}
                // loader={({ src }) => src}
              />
            </div>
          ))}
        </Stack>
      </Stack>
    </Layout>
  );
}
