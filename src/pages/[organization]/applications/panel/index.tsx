import DitchTab, { TabItems } from "@/basicComponents/DitchTab";
import React, { useState } from "react";
import { Avatar, Box, Container, Stack, Typography } from "@mui/material";
import clsx from "clsx";

import CodeSVG from "/public/img/application/panel/code.svg";
import InfiniteSVG from "/public/img/application/panel/infinite.svg";
import CloudSVG from "/public/img/application/panel/cloud.svg";
import Running from "/public/img/application/panel/running.svg";
import Layout from "@/components/Layout";

import styles from "./index.module.scss";
import Image from "next/image";
import { GinIcon, SpringIcon, VueIcon } from "@/utils/CDN";
import DevEnvironment from "@/components/Application/Panel/DevEnvironment";
import RepoList from "@/components/RepoList";

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
      <div className={styles.container}>
        <Stack direction="row" justifyContent="space-between">
          <Stack
            direction="row"
            justifyContent="flex-start"
            className={styles.stackInfo}
          >
            <div className={styles.stackAvatar}>
              <Image
                src={"/img/application/panel/orgAvatar.svg"}
                width={24}
                height={24}
                alt=""
              />
            </div>
            <div className={styles.stackName}>My Shop</div>
            <div className={styles.stackStatus}>
              <Running /> Running
            </div>
          </Stack>
          <Stack
            direction="row"
            justifyContent="flex-start"
            gap={"7.3px"}
            className={styles.stackInfo}
          >
            {techSet.map((tech, index) => (
              <div className={styles.techIcon} key={index}>
                <Image src={tech} alt="" width={25} height={25} />
              </div>
            ))}
          </Stack>
        </Stack>
        <p className={styles.title}>Dev Environments</p>
        <Stack gap="36px">
          <DevEnvironment />
          <DevEnvironment />
        </Stack>
        <p className={styles.title}>Repositories</p>
        <RepoList />
      </div>
    </Layout>
  );
}
