import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { get, has } from "lodash-es";
import $$ from "dodollar";
import { Switch, Typography } from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import HeartBrokenIcon from "@mui/icons-material/HeartBroken";
import RotateLeftIcon from "@mui/icons-material/RotateLeft";
import DoDisturbOnIcon from "@mui/icons-material/DoDisturbOn";
import PanoramaFishEyeIcon from "@mui/icons-material/PanoramaFishEye";
import NotListedLocationIcon from "@mui/icons-material/NotListedLocation";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import Link from "@mui/material/Link";

import LinkSVG from "/public/img/application/panel/env/link.svg";
import Config from "/public/img/application/panel/env/config.svg";
import Gear from "/public/img/application/panel/env/gear.svg";
import { getQuery, getUrlEncodeName } from "@/utils/utils";
import { CommonProps } from "@/utils/commonType";
import {
  GetArgoCDInfoRes,
  HealthStatus,
  SyncStatus,
} from "@/api/application/argo";
import { EnvItemRes } from "@/api/application";
import { EnvContext, IEnvContext } from "@/utils/contexts";

import styles from "./index.module.scss";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Props extends CommonProps {
  env: EnvItemRes | null;
}

export default function Main({ env }: Props): React.ReactElement {
  const router = useRouter();

  const { argoCDInfo, argoCDAutoSync, changeArgoCDAutoSync }: IEnvContext =
    useContext(EnvContext);

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrap}>
        <h1>{env?.name}</h1>
      </div>
      <div className={styles.infoWrap}>
        <span
          onClick={() => {
            const app_id = getQuery("app_id");
            const release_id = getQuery("release_id");
            const env_id = getQuery("env_id");
            router.push(
              `/${getUrlEncodeName()}/applications/panel/env/settings?app_id=${app_id}&release_id=${release_id}&env_id=${env_id}`
            );
          }}
        >
          <Gear />
        </span>
        <span
          onClick={() => {
            let url = get(env, "setting.application.deploy.url", "");
            let valueName = get(
              env,
              "setting.application.deploy.values_file",
              ""
            );
            let path = get(env, "setting.application.deploy.path", "");
            window.open(`${url}/tree/main/${path}/${valueName}`);
          }}
        >
          <Config />
        </span>
      </div>
      <div className={styles.publicUrlWrap}>
        <h2>public url</h2>
        <p>
          <Link
            href={`http://${env?.domain}`}
            target="_blank"
            rel="noreferrer"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "7px",
            }}
          >
            http://{env?.domain}
            <LinkSVG />
          </Link>
        </p>
      </div>
      <div className={styles.issuesWrap}></div>
      <Typography variant="h3">Health</Typography>
      <Typography variant="h3">Current Sync Status</Typography>
      <Typography variant="h3">Last Sync Result</Typography>
      <Typography variant="h3">ArgoCD Auto Sync</Typography>
      <div className={styles.statusWrap}>
        {/* <h3>Health</h3> */}
        {getHealthStatusIcon(
          get(argoCDInfo, "status.health.status") as HealthStatus
        )}
        <div>{get(argoCDInfo, "status.health.status")}</div>
      </div>
      <div className={styles.syncWrap}>
        {/* <Typography variant="h3">Current Sync Status</Typography> */}
        <Typography>Status:</Typography>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "5px",
          }}
        >
          {getSyncStatus(get(argoCDInfo, "status.sync.status") as SyncStatus)}
          {get(argoCDInfo, "status.sync.status")}
        </div>
        <Typography>Revision:</Typography>
        <div>
          {has(argoCDInfo, "status.operationState.syncResult.revision") &&
            has(argoCDInfo, "space.source.repoURL") && (
              <Link
                href={`${get(argoCDInfo, "space.source.repoURL")}/commit/${get(
                  argoCDInfo,
                  "status.operationState.syncResult.revision"
                )}`}
                target="_blank"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: "7px",
                }}
              >
                {(
                  get(
                    argoCDInfo,
                    "status.operationState.syncResult.revision"
                  ) as string
                ).slice(0, 7)}

                <LinkSVG />
              </Link>
            )}
        </div>
      </div>
      <div className={styles.operateStateWrap}>
        {/* <Typography
          variant="h3"
          sx={{
            gridRow: "1 / 5",
            alignSelf: "center",
          }}
        >
          Last Sync Result
        </Typography> */}
        <Typography>Phase:</Typography>
        <div>{get(argoCDInfo, "status.operationState.phase")}</div>
        <Typography>Started At:</Typography>
        <div>
          {dayjs(get(argoCDInfo, "status.operationState.startedAt")).format(
            "YYYY-MM-DD HH:mm:ss"
          )}
        </div>
        <Typography>Finished At:</Typography>
        <div>
          {dayjs(get(argoCDInfo, "status.operationState.finishedAt")).format(
            "YYYY-MM-DD HH:mm:ss"
          )}
        </div>
        <Typography>Message:</Typography>
        <div>{get(argoCDInfo, "status.operationState.message")}</div>
      </div>
      <div className={styles.switchWrap}>
        {/* <Typography variant="h3">ArgoCD Auto Sync</Typography> */}
        <Switch checked={argoCDAutoSync} onChange={changeArgoCDAutoSync} />
      </div>
    </div>
  );
}

function getHealthStatusIcon(healthStatus: HealthStatus) {
  switch (healthStatus) {
    case HealthStatus.HEALTHY:
      return (
        <FavoriteIcon
          sx={{
            color: "#59bb97",
          }}
        />
      );
    case HealthStatus.PROGRESSING:
      return (
        <RotateLeftIcon
          sx={{
            color: "#50a7da",
          }}
        />
      );
    case HealthStatus.DEGRADED:
      return (
        <HeartBrokenIcon
          sx={{
            color: "#d9757b",
          }}
        />
      );
    case HealthStatus.SUSPENDED:
      return (
        <DoDisturbOnIcon
          sx={{
            color: "#747090",
          }}
        />
      );
    case HealthStatus.MISSING:
      return (
        <PanoramaFishEyeIcon
          sx={{
            color: "#eac251",
          }}
        />
      );
    default:
      return (
        <NotListedLocationIcon
          sx={{
            color: "#cdd6da",
          }}
        />
      );
  }
}

function getSyncStatus(syncStatus: SyncStatus) {
  switch (syncStatus) {
    case SyncStatus.SYNCED:
      return (
        <CheckCircleIcon
          sx={{
            color: "#59bb97",
          }}
        />
      );
    case SyncStatus.OUT_OF_SYNC:
      return (
        <UploadFileIcon
          sx={{
            color: "#eac251",
          }}
        />
      );
  }
}
