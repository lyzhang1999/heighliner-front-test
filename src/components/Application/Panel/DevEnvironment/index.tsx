import { Box, Button, Menu, MenuItem, Stack } from "@mui/material";
import React, { useEffect, useState } from "react";

import Running from "/public/img/application/panel/running.svg";
import Play from "/public/img/application/panel/play.svg";
import Stop from "/public/img/application/panel/stop.svg";
import Edit2 from "/public/img/application/panel/edit2.svg";
import Link from "/public/img/application/panel/link.svg";
import Download from "/public/img/application/panel/download.svg";
import Reset from "/public/img/application/panel/reset.svg";

import styles from "./index.module.scss";
import DebugBox from "../DebugBox";
import { useRouter } from "next/router";
import { getOrganizationNameByUrl, getOriIdByContext } from "@/utils/utils";
import {
  getAppEnvironments,
  GetAppEnvironmentsRes,
} from "@/utils/api/application";
import { DownloadTextInClient } from "@/basicComponents/DownloadTextInClient";

export default function DevEnvironment(): React.ReactElement {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const [deploy, setDeploy] = useState(false);

  const [appEnvironments, setAppEnvironments] =
    useState<GetAppEnvironmentsRes>();

  const router = useRouter();
  useEffect(() => {
    const orgId = +getOriIdByContext();
    const appId = +(router.query.app_id as string);
    const releaseId = +(router.query.release_id as string);

    getAppEnvironments({
      org_id: orgId,
      app_id: appId,
    }).then((res) => {
      console.log(res);
      setAppEnvironments(res);
    });
  }, []);

  return (
    <>
      {appEnvironments &&
        appEnvironments.map((appEnvironment, index) => (
          <Stack className={styles.wrap} key={index}>
            <Stack direction="row">
              <Stack className={styles.appStatus} direction="row" gap="8px">
                <div className={styles.appStatusIcon}>
                  <Running />
                </div>
                Running
              </Stack>
              <Stack direction="row" gap={"2vw"} className={styles.infoEntries}>
                <div>
                  <div className={styles.title}>Owner:</div>
                  <div>{getOrganizationNameByUrl()}</div>
                </div>
                <div>
                  <div className={styles.title}>Cluster:</div>
                  <div>{appEnvironment.cluster.name}</div>
                </div>
                <div>
                  <div className={styles.title}>Namespace:</div>
                  <div>{appEnvironment.namespace}</div>
                </div>
                <div>
                  <div className={styles.title}>Chart Version</div>
                  <div>{appEnvironment.space.chart.version}</div>
                </div>
                <div className={styles.operationInRow}>
                  <div className={styles.title}>Chart Values</div>
                  <div className={styles.item}>
                    <Edit2 fill="#326ce5" />
                    &nbsp;Edit
                  </div>
                </div>
                <div className={styles.operationInRow}>
                  <div className={styles.title}>Preview URL:</div>
                  <a
                    className={styles.item}
                    href={appEnvironment.space.access.previewURL}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <Link fill="#326ce5" />
                    &nbsp;Click me
                  </a>
                </div>
                <div className={styles.operationInRow}>
                  <div className={styles.title}>Kubeconfig</div>
                  <div className={styles.item}>
                    <DownloadTextInClient
                      filename={"kubeconfig.yaml"}
                      content={appEnvironment.cluster.kubeconfig}
                      className={styles.download}
                    >
                      <Download fill="#326ce5" />
                      &nbsp;Download
                    </DownloadTextInClient>
                  </div>
                </div>
              </Stack>
            </Stack>
            <Stack direction="row" gap="21px" className={styles.apps}>
              {appEnvironment.resources.map((resource, index) => (
                <DebugBox
                  key={index}
                  resource={resource}
                  appEnvironment={appEnvironment}
                />
              ))}
            </Stack>
            <Stack direction="row" className={styles.operator}>
              <Stack
                direction="row"
                alignItems="center"
                style={{ display: deploy ? "none" : "flex" }}
                onClick={() => {
                  setDeploy(true);
                }}
              >
                <Play />
                <span>Deploy</span>
              </Stack>
              <Stack
                direction="row"
                alignItems="center"
                style={{ display: deploy ? "flex" : "none" }}
                onClick={() => {
                  setDeploy(false);
                }}
              >
                <Stop />
                <span>Stop</span>
              </Stack>
              <div>
                <Button
                  id="basic-button"
                  aria-controls={open ? "basic-menu" : undefined}
                  aria-haspopup="true"
                  aria-expanded={open ? "true" : undefined}
                  onClick={handleClick}
                >
                  ...
                </Button>
                <Menu
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    "aria-labelledby": "basic-button",
                  }}
                >
                  <MenuItem
                    onClick={handleClose}
                    className={styles.operationInMenu}
                  >
                    <Edit2 />
                    &nbsp;Edit
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className={styles.operationInMenu}
                  >
                    <Link />
                    &nbsp;click me
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    className={styles.operationInMenu}
                  >
                    {/* <Download />
                  &nbsp;download */}
                    <DownloadTextInClient
                      filename={"kubeconfig.yaml"}
                      content={appEnvironment.cluster.kubeconfig}
                      className={styles.download}
                      style={{ color: "#000" }}
                    >
                      <Download />
                      &nbsp;Download
                    </DownloadTextInClient>
                  </MenuItem>
                  <MenuItem onClick={handleClose}>
                    <Reset />
                    &nbsp;Reset
                  </MenuItem>
                </Menu>
              </div>
            </Stack>
          </Stack>
        ))}
    </>
  );
}
