import React, { useState, useEffect, useContext } from "react";
import Image from "next/image";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Checkbox,
} from "@mui/material";

import { Context } from "@/utils/store";
import { IEnvContext, EnvContext } from "@/utils/contexts";
import { CommonProps } from "@/utils/commonType";
import { getToken } from "@/utils/token";
import { GetEnvResourcesRes } from "@/api/application";

import styles from "./index.module.scss";
import { $$ } from "@/utils/console";

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
  const [enableArgoCDAutoSync, setEnableArgoCDAutoSync] = useState(true);
  const [disableArgoCDAutoSync, setDisableArgoCDAutoSync] = useState(true);

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

  function getParameters(action: ExecuteType) {
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
    };

    return parameters;
  }

  function wakeUpVSCode(qsObj: any): void {
    const searchParams = new URLSearchParams(qsObj);
    window.open(`vscode://forkmain.forkmain?${searchParams.toString()}`);
  }

  const handleDev = (action: ExecuteType) => {
    const parameters = getParameters(action);
    wakeUpVSCode(parameters);
  };

  const getExecutor = (type: ExecuteType) => () => {
    switch (true) {
      case type === ExecuteType.RUN || type === ExecuteType.DEBUG:
        // Need to close ArgoCD auto sync.
        if (envContext.argoCDAutoSync) {
          setExecuteType(type);
          setOpen(true);
          return;
        }
        break;
      case type === ExecuteType.STOP:
        // Need to open ArgoCD auto sync.
        if (!envContext.argoCDAutoSync) {
          setExecuteType(type);
          setOpen(true);
          return;
        }
        break;
    }
    handleDev(type);
  };

  const preExecute = () => {
    switch (true) {
      case executeType === ExecuteType.RUN || executeType === ExecuteType.DEBUG:
        // Close ArgoCD auto sync.
        if (envContext.argoCDAutoSync && disableArgoCDAutoSync) {
          envContext.changeArgoCDAutoSync && envContext.changeArgoCDAutoSync();
        }
        break;
      case executeType === ExecuteType.STOP:
        // Open ArgoCD auto sync.
        if (!envContext.argoCDAutoSync && enableArgoCDAutoSync) {
          envContext.changeArgoCDAutoSync && envContext.changeArgoCDAutoSync();
        }
        break;
    }
  };

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
          <>
            <li onClick={getExecutor(ExecuteType.RUN)} title="Develop">
              <Image
                src="/img/application/panel/env/start@3x.png"
                objectFit="contain"
                alt=""
                width={22}
                height={22}
              />
              Reenter Development
            </li>
            <li onClick={getExecutor(ExecuteType.STOP)} title="Stop">
              <Image
                src="/img/application/panel/env/stop@3x.webp"
                alt="stop"
                width={22}
                height={22}
                objectFit="contain"
              />
              End Development
            </li>
          </>
        ) : (
          <>
            {/* <li onClick={getExecutor(ExecuteType.DEBUG)} title="Debug">
              <Image
                src="/img/application/panel/env/debug@3x.png"
                alt=""
                objectFit="contain"
                width={22}
                height={22}
              />
              Start Debug
            </li> */}
            <li onClick={getExecutor(ExecuteType.RUN)} title="Develop">
              <Image
                src="/img/application/panel/env/start@3x.png"
                // layout="fill"
                objectFit="contain"
                alt=""
                width={22}
                height={22}
              />
              Develop
            </li>
          </>
        )}
      </ul>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {executeType === ExecuteType.RUN && "Start Remote Development"}
          {executeType === ExecuteType.DEBUG && "Start Remote Debug"}
          {executeType === ExecuteType.STOP && "End Remote Development"}
        </DialogTitle>
        <DialogContent>
          <div className={styles.dialogContentTextWrap}>
            {executeType === ExecuteType.RUN && (
              <>
                <p>In remote development mode, you can:</p>
                <ul>
                  <li>Edit source code in your local IDE.</li>
                  <li>
                    Compile and run your source code in remote dev-container
                    with one click.
                  </li>
                  <li>Enjoy live-reload code editing with 0 configuration.</li>
                  <li>Preview code changes in seconds.</li>
                </ul>
                <p>Tips: Automatic GitOps Sync need to be disabled.</p>
              </>
            )}
            {executeType === ExecuteType.DEBUG && (
              <>
                <p>In remote debug mode, you can:</p>
                <ul>
                  <li>Edit source code in your local IDE.</li>
                  <li>
                    Compile and run your source code in remote dev-container
                    with one click.
                  </li>
                  <li>Enjoy live-reload code editing with 0 configuration.</li>
                  <li>Preview code changes in seconds.</li>
                  <li>
                    Debug step by step in your local IDE with breakpoints.
                  </li>
                </ul>
                <p>Tips: Automatic GitOps Sync need to be disabled.</p>
              </>
            )}
            {executeType === ExecuteType.STOP && (
              <>
                <p>Once ended remote development mode:</p>
                <ul>
                  <li>Workload would run with origin container images.</li>
                  <li>
                    File syncing between local and remote workspace would be
                    stopped.
                  </li>
                </ul>
                <p>
                  Tips: Automatic GitOps Sync need to be enabled to keep the
                  environment in track
                </p>
              </>
            )}
            {executeType === ExecuteType.STOP ? (
              <>
                <Checkbox
                  checked={enableArgoCDAutoSync}
                  onClick={() =>
                    setEnableArgoCDAutoSync((preState) => !preState)
                  }
                />{" "}
                Enable ArgoCD Auto Sync
              </>
            ) : (
              <>
                <Checkbox
                  checked={disableArgoCDAutoSync}
                  onClick={() =>
                    setDisableArgoCDAutoSync((preState) => !preState)
                  }
                />{" "}
                Disable ArgoCD Auto Sync
              </>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              preExecute();
              handleDev(executeType!);
              setOpen(false);
            }}
            variant="contained"
          >
            {executeType === ExecuteType.RUN && "Start to develop in VS Code"}
            {executeType === ExecuteType.DEBUG && "Start to debug in VS Code"}
            {executeType === ExecuteType.STOP && "End Remote Development"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
