import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

import { Context } from "@/utils/store";
import { IEnvContext, EnvContext } from "@/utils/contexts";
import { CommonProps } from "@/utils/commonType";
import { getToken } from "@/utils/token";
import { GetEnvResourcesRes } from "@/api/application";

import styles from "./index.module.scss";

interface Props extends CommonProps {
  env: any;
  resource: GetEnvResourcesRes[number];
}

enum DevStatus {
  NORMAL = "normal",
  RUNNING = "running",
  INITING = "initing",
}

enum ExecuteType {
  DEBUG = "debug",
  RUN = "run",
  STOP = "stop",
}

export default function HoverTools(props: Props) {
  const { state: globalState, dispatch: globalStateDispatch } =
    useContext(Context);
  const envContext: IEnvContext = useContext(EnvContext);

  const [devState, setDevState] = useState<DevStatus>(DevStatus.NORMAL);

  const [open, setOpen] = useState(false);
  const [executeType, setExecuteType] = useState<ExecuteType>();

  const handleClose = () => {
    setOpen(false);
  };

  useEffect(() => {
    if (props.resource.container) {
      const isDeveloping = props.resource.container.some(
        (container) => container.name === "nocalhost-dev"
      );
      if (isDeveloping) {
        setDevState(DevStatus.RUNNING);
      } else {
        setDevState(DevStatus.NORMAL);
      }
    }
  }, [props.resource]);

  const { env, resource } = props;

  function getParameters(action: string) {
    const token = getToken();
    if (!token) {
      console.error("Error: No token found, exit.");
      return;
    }

    const { namespace, name, type } = resource;

    const parameters: any = {
      action,
      token,
      namespace: namespace,
      application: "default",
      workload_type: type,
      workload: name,
      organization: globalState?.currentOrganization?.name,
      email: globalState?.userInfo?.email,
      app: env.application_id,
      service: name,
      env: env.name,
      baseUrl: window.location.origin,
      orgId: globalState?.currentOrganization?.org_id,
      clusterId: env.last_release.cluster_id,
    }

    return parameters;
  }

  function wakeUpVSCode(qsObj: any): void {
    const searchParams = new URLSearchParams(qsObj);
    window.open(`vscode://forkmain.forkmain?${searchParams.toString()}`);
  }

  const handleDev = (action: string) => {
    const parameters = getParameters(action)
    wakeUpVSCode(parameters)
  }

  function pre(type: ExecuteType) {
    return () => {
      switch (type) {
        case ExecuteType.RUN:
          if (envContext.argoCDAutoSync) {
            setExecuteType(type);
            setOpen(true);
            return;
          }
          break;
        case ExecuteType.DEBUG:
          if (envContext.argoCDAutoSync) {
            setExecuteType(type);
            setOpen(true);
            return;
          }
          break;
        case ExecuteType.STOP:
          if (!envContext.argoCDAutoSync) {
            setExecuteType(type);
            setOpen(true);
            return;
          }
          break;
      }
      handleContributor(type);
    };
  }

  function executeAfterChangeArgoCDAutoSync(type: ExecuteType) {
    envContext.changeArgoCDAutoSync && envContext.changeArgoCDAutoSync();
    handleContributor(type);
  }

  function handleContributor(type: ExecuteType) {
    switch (type) {
      case ExecuteType.DEBUG:
        handleDev('debug')
        break;
      case ExecuteType.RUN:
        handleDev('run')
        break;
      case ExecuteType.STOP:
        handleDev('stop')
        break;
    }
  }

  return (
    <>
      <ul className={styles.wrapper}>
        {/* <li>
          <Image
            src="/img/application/panel/env/circle@3x.png"
            layout="fill"
            objectFit="contain"
            alt=""
          />
        </li>
        <li>
          <Image
            src="/img/application/panel/env/circuit@3x.png"
            layout="fill"
            objectFit="contain"
            alt=""
          />
        </li>
        <li>
          <Image
            src="/img/application/panel/env/edit@3x.png"
            layout="fill"
            objectFit="contain"
            alt=""
          />
        </li>
        <li>
          <Image
            src="/img/application/panel/env/setting@3x.png"
            layout="fill"
            objectFit="contain"
            alt=""
          />
        </li> */}
        {devState === DevStatus.RUNNING ? (
          <li onClick={pre(ExecuteType.STOP)} title="Stop">
            <Image
              src="/img/application/panel/env/stop@3x.webp"
              alt="stop"
              layout="fill"
              objectFit="contain"
            />
          </li>
        ) : (
          <div style={{ display: "flex" }}>
            <li
              onClick={pre(ExecuteType.DEBUG)}
              title="Debug"
              style={{ marginRight: 10 }}
            >
              <Image
                src="/img/application/panel/env/debug@3x.png"
                layout="fill"
                objectFit="contain"
                alt=""
              />
            </li>
            <li onClick={pre(ExecuteType.RUN)} title="Develop">
              <Image
                src="/img/application/panel/env/start@3x.png"
                layout="fill"
                objectFit="contain"
                alt=""
              />
            </li>
          </div>
        )}
      </ul>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {executeType === ExecuteType.STOP ? (
            <>
              Open <b>ArgoCD Auto Sync</b> when you stop Run/Debug project?
            </>
          ) : (
            <>
              Close <b>ArgoCD Auto Sync</b> during Run/Debug project in local?
            </>
          )}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {executeType === ExecuteType.STOP ? (
              <>
                Open <b>ArgoCD Auto Sync</b> will monitor your environment and
                try to fix it in case is broken accidentally.
              </>
            ) : (
              <>
                Close <b>ArgoCD Auto Sync</b> will improve your development
                experience by avoiding unknown expectation from ArgoCD auto
                sync.
              </>
            )}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              handleContributor(executeType!);
              handleClose();
            }}
            variant="outlined"
          >
            Keep it
          </Button>
          <Button
            onClick={() => {
              executeAfterChangeArgoCDAutoSync(executeType!);
              handleClose();
            }}
            variant="contained"
          >
            {executeType === ExecuteType.STOP ? "Open it" : "Close it"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
