import { Box, Stack } from "@mui/material";
import React, { useContext } from "react";
import Image from "next/image";
import clsx from "clsx";

import MultiShape from "/public/img/application/panel/multiShape.svg";
import Search from "/public/img/application/panel/search.svg";
import Edit from "/public/img/application/panel/edit.svg";
import Stats from "/public/img/application/panel/stats.svg";
import WWW from "/public/img/application/panel/www.svg";
import Set from "/public/img/application/panel/set.svg";
import { GetAppEnvironmentsRes, WorkloadType } from "@/utils/api/application";

import styles from "./index.module.scss";
import { ApplicationInfoContext } from "@/pages/[organization]/applications/panel";

interface Props {
  appEnvironment: GetAppEnvironmentsRes[number];
  resource: GetAppEnvironmentsRes[number]["resources"][number];
}

enum Action {
  Run = "run",
  Debug = "debug",
}

interface OpenVSCode {
  [index: string]: string;
  kubeconfig: string;
  namespace: string;
  application: string;
  workload: string;
  workload_type: WorkloadType;
  action: Action;
}

export default function DebugBox({
  appEnvironment,
  resource,
}: Props): React.ReactElement {
  const applicationInfo = useContext(ApplicationInfoContext);

  const openVSCode = (action: Action) => {
    const parameters: OpenVSCode = {
      kubeconfig: appEnvironment.cluster.kubeconfig,
      namespace: resource.namespace,

      application: applicationInfo.name,
      workload: resource.name,
      workload_type: resource.type,
      action: action,
    };

    // console.log(parameters)

    const queryString = new URLSearchParams(parameters);
    window.open(`vscode://nocalhost.nocalhost?${queryString.toString()}`);
  };

  return (
    <Stack justifyContent="center">
      <Box className={styles.box}>
        <Indicators total={resource.total} readyTotal={resource.ready_total} />
        <div className={styles.appName}>
          <MultiShape />
          <div className={styles.name}>{resource.name}</div>
        </div>
        <div className={styles.debug}>
          <div
            className={styles.name}
            onClick={() => {
              openVSCode(Action.Debug);
            }}
          >
            <div className={styles.icon}>
              <Image
                src="/img/application/panel/vscode@3x.png"
                alt=""
                width={18.6}
                height={20}
              />
            </div>
            Debug
          </div>
        </div>
        <div className={styles.debug}>
          <div
            className={styles.name}
            onClick={() => {
              openVSCode(Action.Run);
            }}
          >
            <div className={styles.icon}>
              <Image
                src="/img/application/panel/vscode@3x.png"
                alt=""
                width={18.6}
                height={20}
              />
            </div>
            Run
          </div>
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
