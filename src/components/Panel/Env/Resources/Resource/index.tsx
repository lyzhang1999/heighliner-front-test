import React, { Dispatch, SetStateAction, useState } from "react";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";
import ArrowRightRoundedIcon from "@mui/icons-material/ArrowRightRounded";

import styles from "./index.module.scss";
import { Tooltip, Typography } from "@mui/material";
import Image from "next/image";
import { GetEnvResourcesRes } from "@/api/application/env";
import { SubHeader } from "..";
import { getOriIdByContext, getQuery } from "@/utils/utils";
import { ResourceType } from "@/api/application";

export interface GetLogParams {
  container_name: string;
  pod_name: string;
  resource_name: string;
  resource_type: ResourceType;
  org_id: string;
  app_id: string;
  env_id: string;
}
interface Props extends CommonProps {
  envResource: GetEnvResourcesRes[number];
  logsParams: null | GetLogParams;
  setLogsParams: Dispatch<SetStateAction<GetLogParams | null>>;
  setLogVisible: Dispatch<SetStateAction<boolean>>;
}

export default function Resource({
  envResource,
  logsParams,
  setLogsParams,
  setLogVisible,
}: Props): React.ReactElement {
  const [chosenPod, setChosenPod] = useState(0);
  const handleChosenPod = (index: number) => () => {
    setChosenPod(index);
  };

  const app_id = getQuery("app_id");
  const env_id = getQuery("env_id");
  const org_id = getOriIdByContext();

  const handleOpenLogs =
    (
      partialLogsParams: Pick<
        GetLogParams,
        "container_name" | "pod_name" | "resource_name" | "resource_type"
      >
    ) =>
    () => {
      setLogsParams({
        ...partialLogsParams,
        org_id,
        app_id,
        env_id,
      });
      setLogVisible(true);
    };

  return (
    <div className={styles.wrapper}>
      <Typography
        sx={{
          fontSize: "16px",
          fontWeight: 600,
          color: "#222f42",
        }}
      >
        {envResource.name}
      </Typography>
      <div className={styles.podsStatusBar}>
        <SubHeader>Pods:</SubHeader>
        <ul>
          {envResource.pods.map((pod, index) => (
            <li
              key={index}
              className={clsx(
                styles[pod.status],
                chosenPod === index && styles.chosenStatus
              )}
              onClick={handleChosenPod(index)}
            >
              {pod.status}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <p
          style={{
            maxWidth: "500px",
            overflow: "hidden",
            whiteSpace: "nowrap",
            textOverflow: "ellipsis",
          }}
        >
          <SubHeader>Pod Name: </SubHeader>{" "}
          <Tooltip title={envResource.pods[chosenPod].name}>
            <span>{envResource.pods[chosenPod].name}</span>
          </Tooltip>
        </p>
        <SubHeader>Containers:</SubHeader>
        <div className={styles.containerWrap}>
          {envResource.pods[chosenPod].container.map((container) => (
            <li key={container.name}>
              <ArrowRightRoundedIcon
                sx={{
                  color: "#88a4da",
                }}
              />
              <p>Name:</p>
              <p className={styles.containerNameWrapper}>
                <span className={styles.containerName}>{container.name}</span>
              </p>
              <ArrowRightRoundedIcon
                sx={{
                  color: "#88a4da",
                }}
              />
              <p>Image:</p>
              <Tooltip title={container.image || ""}>
                <p>{container.image}</p>
              </Tooltip>
              <ArrowRightRoundedIcon
                sx={{
                  color: "#88a4da",
                }}
              />
              <p>Logs:</p>
              <p className={styles.logsWrap}>
                <Image
                  className={styles.containerImg}
                  src="/img/application/panel/env/logs.png"
                  alt="container log"
                  width={18}
                  height={18}
                  objectFit="contain"
                  onClick={handleOpenLogs({
                    container_name: envResource.name,
                    resource_name: container.name,
                    resource_type: envResource.type,
                    pod_name: envResource.pods[chosenPod].name,
                  })}
                  style={{
                    cursor: "pointer",
                  }}
                />
              </p>
            </li>
          ))}
        </div>
      </div>
    </div>
  );
}
