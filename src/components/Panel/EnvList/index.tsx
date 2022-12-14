import { get } from "lodash-es";
import clsx from "clsx";
import React, { Fragment, useState } from "react";
import LinkIcon from "@mui/icons-material/Link";
import { useRouter } from "next/router";
import SettingsIcon from "@mui/icons-material/Settings";
import { Link as MUILink, Skeleton, Tooltip } from "@mui/material";
import CopyAllIcon from '@mui/icons-material/CopyAll';
import copy from 'copy-to-clipboard';

import RightDrawer from "@/basicComponents/RightDrawer";
import { EnvItemRes, ForkRes, StatusColor } from "@/api/application";
import { formatDate, getQuery, getUrlEncodeName, Message } from "@/utils/utils";

import styles from "./index.module.scss";
// import ForkEnvForWebApp from "./ForkNewEnv/ForkEnvForWebApp";
import Link from "/public/img/application/panel/env/link.svg";
import ForkEnvForMicroService from "./ForkNewEnv/ForkEnvForMicroService";

export const itemClass = "CANVASITME";

interface Props {
  spreadCb: () => void;
  envlist: EnvItemRes[];
  forkSuccessCb?: (res: ForkRes) => void;
}

export default function EnvList({ spreadCb, envlist, forkSuccessCb }: Props) {
  const [spreadIndex, setSpreadIndex] = useState<number>(-1);
  const [modalDisplay, setModalDisplay] = useState(false);

  const router = useRouter();
  const app_id = getQuery("app_id");

  const openForkNewEnvDrawer = () => {
    setModalDisplay(true);
  };

  const handlePageChange =
    (
      page: "env panel" | "env settings" | "logs",
      env_id: number,
      release_id: number
    ) =>
      () => {
        switch (page) {
          case "env panel":
            router.push(
              `/${getUrlEncodeName()}/applications/panel/env?app_id=${app_id}&release_id=${release_id}&env_id=${env_id}`
            );
            break;
          case "env settings":
            router.push(
              `/${getUrlEncodeName()}/applications/panel/env/settings?app_id=${app_id}&release_id=${release_id}&env_id=${env_id}`
            );
            break;
          case "logs":
            router.push(
              `/${getUrlEncodeName()}/applications/creating?app_id=${getQuery(
                "app_id"
              )}&release_id=${release_id}&foromPane=true`
            );
            break;
        }
      };

  return (
    <div className={styles.wrapper}>
      {(!envlist || envlist.length <= 0) &&
        [1, 2, 3].map((i) => (
          <Skeleton
            key={i}
            variant="rectangular"
            width={500}
            height={100}
            sx={{ marginTop: "50px" }}
          />
        ))}
      {envlist.map((i, index) => {

        return (
          <Fragment key={index}>
            <div
              key={index}
              className={clsx(
                styles.item,
                itemClass,
                index === spreadIndex && styles.spreadItem
              )}
            >
              <div
                className={styles.previewWrapper}
                style={{
                  right: "175px",
                  top: "-31px",
                  color: "#1b51b9",
                }}
                onClick={handlePageChange(
                  "env settings",
                  i.application_env_id,
                  i.last_release.id
                )}
              >
                <SettingsIcon />
                <span className={styles.preview}>&nbsp;Settings</span>
              </div>
              <div
                className={styles.previewWrapper}
                style={{
                  right: "91px",
                  top: "-31px",
                  color: "#1b51b9",
                }}
                onClick={handlePageChange(
                  "env panel",
                  i.application_env_id,
                  i.last_release.id
                )}
              >
                <LinkIcon />
                <span className={styles.preview}>&nbsp;Details</span>
              </div>
              <div
                className={styles.previewWrapper}
                onClick={() => {
                  window.open("http://" + i.domain);
                }}
              >
                <img src="/img/application/panel/preview.svg" alt="" />
                <span className={styles.preview}>Preview</span>
              </div>
              <div className={styles.star}></div>
              <div className={styles.header}>
                <div
                  className={styles.envName}
                  onClick={handlePageChange(
                    "env panel",
                    i.application_env_id,
                    i.last_release.id
                  )}
                >
                  {i.name}
                </div>
              </div>
              <div className={styles.previewURLWrap}>
                Preview URL:
                <div>
                  <Tooltip title={`http://${i.domain}`}>
                    <MUILink
                      href={`http://${i.domain}`}
                      target="_blank"
                      rel="noreferrer"
                      underline="hover"
                    >
                      http://{i.domain}
                    </MUILink>
                  </Tooltip>
                  <div
                    onClick={() => {
                      copy(`http://${i.domain}`);
                      Message.success(
                        `Copy the URL "http://${i.domain}" to clipboard.`
                      );
                    }}
                  >
                    <CopyAllIcon fontSize="small" color="primary" />
                  </div>
                </div>
              </div>
              {i.github_issues && i.github_issues.length >= 1 && (
                <div className={styles.issuesWrap}>
                  Issues:
                  <ul>
                    {i.github_issues.map((issue, index) => (
                      <li key={index}>
                        <Tooltip title={i.github_issues[index].url}>
                          <MUILink
                            underline="hover"
                            href={i.github_issues[index].url}
                            target="_blank"
                          >
                            {i.github_issues[index].title ||
                              i.github_issues[index].url}
                          </MUILink>
                        </Tooltip>
                        <MUILink
                          href={i.github_issues[index].url}
                          target="_blank"
                        >
                          <Link />
                        </MUILink>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <div className={styles.infoWrapper}>
                <div className={styles.statusWrapper}>
                  <span className={styles.key}>Status:</span>
                  <span className={styles.value}>
                    <span
                      className={styles.circle}
                      style={{
                        backgroundColor: get(
                          StatusColor,
                          get(i, "last_release.status", ""),
                          "red"
                        ),
                      }}
                    ></span>
                    <span className={styles.statusValue}>
                      {get(i, "last_release.status", "")}
                    </span>
                  </span>
                </div>
                <div>
                  <span className={styles.key}>Owner:</span>
                  <span className={styles.statusValue}>{i.owner_name}</span>
                </div>
                {/* <div className={styles.configWrapper}>
                  <span className={styles.key}>Configs:</span>
                  <span
                    className={styles.configValue}
                    onClick={() => {
                      let url = get(i, "setting.application.deploy.url", "");
                      let valueName = get(
                        i,
                        "setting.application.deploy.values_file",
                        ""
                      );
                      let name = i.name;
                      let path = get(i, "setting.application.deploy.path", "");
                      window.open(`${url}/tree/main/${path}/${valueName}`);
                    }}
                  >
                    {get(i, "setting.application.deploy.values_file", "")}
                  </span>
                </div> */}
                <div className={styles.logsWrapper}>
                  <span className={styles.key}>Deploy Timeline:</span>
                  <span
                    className={styles.logsValue}
                    onClick={handlePageChange(
                      "logs",
                      i.application_env_id,
                      i.last_release.id
                    )}
                  >
                    {`${formatDate(Number(i.create_time) * 1000)}`}
                  </span>
                </div>
              </div>
            </div>
            {index === 0 && (
              <div
                className={clsx(styles.forkEnv, itemClass)}
                onClick={openForkNewEnvDrawer}
              >
                <div className={styles.star}></div>
                <img src="/img/application/panel/forkenv.svg" alt="" />
                <span className={styles.desc}>Fork a new environment</span>
                <RightDrawer
                  {...{
                    title: "Fork an Environment From Main",
                    modalDisplay,
                    setModalDisplay,
                    width: "700px",
                  }}
                >
                  {/* <ForkEnvForWebApp
                    {...{
                      forkSuccessCb: (res) => {
                        setModalDisplay(false);
                        forkSuccessCb && forkSuccessCb(res);
                      },
                    }}
                  /> */}
                  <ForkEnvForMicroService />
                </RightDrawer>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
