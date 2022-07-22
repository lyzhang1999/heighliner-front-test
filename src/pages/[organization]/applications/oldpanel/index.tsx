import React, {createContext, useEffect, useState} from "react";
import {Box, Stack} from "@mui/material";
import Image from "next/image";

import CodeSVG from "/public/img/application/panel/code.svg";
import InfiniteSVG from "/public/img/application/panel/infinite.svg";
import CloudSVG from "/public/img/application/panel/cloud.svg";
import Running from "/public/img/application/panel/running.svg";
import Layout from "@/components/Layout";
import DitchTab, {TabItems} from "@/basicComponents/DitchTab";
import {GinIcon, SpringIcon, VueIcon} from "@/utils/CDN";
import DevEnvironment from "@/components/Application/Panel/DevEnvironment";
import RepoList from "@/components/Application/Panel/RepoList";

import styles from "./index.module.scss";
import {
  ApplicationStatus,
  getApplicationInfo,
  GetApplicationInfoRes,
  getApplicationStatus,
} from "@/api/application";
import {useRouter} from "next/router";
import {getOriIdByContext} from "@/utils/utils";

enum TabItemLabels {
  Code = "Code",
  Ship = "Ship",
  Run = "Run",
}

const tabItems: TabItems<keyof typeof TabItemLabels> = [
  {
    label: TabItemLabels.Code,
    icon: <CodeSVG fill="#404a59"/>,
    selectedIcon: <CodeSVG fill="#FFFFFF"/>,
  },
  {
    label: TabItemLabels.Ship,
    icon: <InfiniteSVG fill="#404a59"/>,
    selectedIcon: <InfiniteSVG fill="#FFFFFF"/>,
  },
  {
    label: TabItemLabels.Run,
    icon: <CloudSVG fill="#404a59"/>,
    selectedIcon: <CloudSVG fill="#FFFFFF"/>,
  },
];

const techSet = [GinIcon, VueIcon, SpringIcon];

export const ApplicationInfoContext = createContext<GetApplicationInfoRes>({
  cluster_id: 0,
  created_at: 0,
  domain: "",
  git_org_name: "",
  git_provider: "",
  git_token: "",
  id: 0,
  name: "",
  org_id: 0,
  stack_id: 0,
  updated_at: 0,
  updated_by: 0,
  created_by: 0
});

export default function Panel(): React.ReactElement {
  const router = useRouter();
  const [applicationInfo, setApplicationInfo] =
    useState<GetApplicationInfoRes>();
  const [status, setStatus] = useState<ApplicationStatus>();
  const [selectedItem, setSelectedItem] = useState<keyof typeof TabItemLabels>(
    TabItemLabels.Code
  );

  useEffect(() => {
    const orgId = getOriIdByContext();
    const appId = router.query.app_id as string;
    const releaseId = router.query.release_id as string;

    getApplicationInfo({
      app_id: +appId,
      org_id: +orgId,
    }).then((res) => {
      setApplicationInfo(res);
    });

    getApplicationStatus({
      app_id: appId,
      release_id: releaseId,
    }).then((res) => {
      setStatus(res.status);
    });
  }, []);

  return (
    <Layout notStandardLayout>
      <ApplicationInfoContext.Provider value={applicationInfo!}>
        <Stack alignItems="center" className={styles.tabs}>
          <DitchTab<keyof typeof TabItemLabels>
            selectedItem={selectedItem}
            tabItems={tabItems}
            setSelectedItem={setSelectedItem}
          />
        </Stack>
        <Stack
          direction="row"
          justifyContent="space-between"
          className={styles.appInfoWrap}
        >
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
            <div className={styles.stackName}>{applicationInfo?.name}</div>
            <div className={styles.stackStatus}>
              {status && status === ApplicationStatus.COMPLETED && (
                <>
                  <Running/> Running
                </>
              )}
              {status && status === ApplicationStatus.FAILED && <>Failed</>}
              {status && status === ApplicationStatus.PROCESSING && (
                <>Creating</>
              )}
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
                <Image src={tech} alt="" width={25} height={25}/>
              </div>
            ))}
          </Stack>
        </Stack>
        <div className={styles.container}>
          <p className={styles.title}>Dev Environments</p>
          <Stack gap="36px">
            <DevEnvironment/>
          </Stack>
          <div className={styles.titleRepo}>Repositories</div>
          <RepoList/>
        </div>
      </ApplicationInfoContext.Provider>
    </Layout>
  );
}