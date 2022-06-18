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
import { getOriIdByContext } from "@/utils/utils";
import {
  getAppEnvironments,
  GetAppEnvironmentsRes,
} from "@/utils/api/application";
import { stringify } from "querystring";
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

  const [appEnvironments, setAppEnvironments] = useState<GetAppEnvironmentsRes>(
    [
      {
        cluster: {
          created_at: 0,
          id: 0,
          in_cluster: true,
          kubeconfig: "kubeconfig",
          name: "cluster-name",
          org_id: 0,
          provider: "provider",
          updated_at: 0,
        },
        name: "app",
        namespace: "namespace",
        resources: [
          {
            name: "resources-name",
            namespace: "resources-namespace",
            type: "type",
          },
        ],
        status: "running",
      },
    ]
  );

  const router = useRouter();
  // Get the app_id in URL and org_id
  const appId = +(router.query.application as string);
  const orgId = +getOriIdByContext();
  
  console.group('>>>>><<<<<<');
  console.log(appId);
  console.log(orgId);
  console.groupEnd();
  

  useEffect(() => {
    if (
      appId === undefined ||
      appId <= 0 ||
      orgId === undefined ||
      orgId <= 0
    ) {
      return;
    }

    getAppEnvironments({
      org_id: orgId,
      app_id: appId,
    }).then((res) => {
      console.log(res);
      // setAppEnvironments(res);
    });
  }, []);

  return (
    <>
      {appEnvironments.map((appEnvironment, index) => (
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
                <div>zhenwei</div>
              </div>
              <div>
                <div className={styles.title}>Cluster:</div>
                <div>AWS-Dev-1</div>
              </div>
              <div>
                <div className={styles.title}>Namespace:</div>
                <div>nh4xidf</div>
              </div>
              <div>
                <div className={styles.title}>Chart Version</div>
                <div>v1.0.2</div>
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
                <div className={styles.item}>
                  <Link fill="#326ce5" />
                  &nbsp;Click me
                </div>
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
            <DebugBox />
            <DebugBox />
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
                    style={{color: "#000"}}
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
