import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import NoiseControlOffIcon from "@mui/icons-material/NoiseControlOff";

import { CommonProps } from "@/utils/commonType";
import LeftSideTabs from "@/basicComponents/CustomTab/LeftSideTabs";
import Docker from "/public/img/application/panel/env/docker.svg";
import {getOriIdByContext, getQuery} from "@/utils/utils";
import HoverTools from "./HoverTools";
import useEnvResources from "@/hooks/envResources";

import styles from "./index.module.scss";
import Resource from "./Resource";
import { Tooltip, Typography } from "@mui/material";
import { ResourceType } from "@/api/application";
import WorkloadLog from "@/components/WorkloadLog";

interface Props extends CommonProps {
  env: any;
  selectedResourceType: ResourceType;
}

export interface GetLogParams {
  container_name: string,
  resource_name: string,
  resource_type: ResourceType,
  org_id: string,
  app_id: string,
  env_id: string,
}

export default function Resources(props: Props): React.ReactElement {
  const [envResources, flushEnvResources] = useEnvResources({
    app_id: +getQuery("app_id"),
    env_id: +getQuery("env_id"),
  });
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const [logVisible, setLogVisible] = useState<boolean>(false);
  const [logsParams, setLogsParams] = useState<null | GetLogParams>(null);

  useEffect(() => {
    flushEnvResources({
      resource_type: props.selectedResourceType,
    });

    if (timer) {
      clearInterval(timer);
      const newTimer = setInterval<Parameters<typeof flushEnvResources>>(
        flushEnvResources,
        5000,
        {
          resource_type: props.selectedResourceType,
        }
      );
      setTimer(newTimer);
      timerRef.current = newTimer;
    }

    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, [props.selectedResourceType]);

  useEffect(() => {
    const newTimer = setInterval<Parameters<typeof flushEnvResources>>(
      flushEnvResources,
      5000,
      {
        resource_type: props.selectedResourceType,
      }
    );
    setTimer(newTimer);
    timerRef.current = newTimer;

    return () => {
      timerRef.current && clearInterval(timerRef.current);
    };
  }, []);

  // useEffect(() => {}, [timer]);

  return (
    <ul className={styles.wrapper}>
      {envResources.map((envResource) => (
        <LeftSideTabs
          key={envResource.name}
          tabs={[
            {
              icon: composeIcon(<Docker />),
              content: (
                <Resource
                  {...{
                    name: envResource.name,
                    replicas: envResource.status.replicas,
                    ready_replicas: envResource.status.ready_replicas,
                  }}
                >
                  <Typography
                    variant="h2"
                    sx={{
                      fontSize: "16px",
                      marginTop: "6.5px",
                    }}
                  >
                    Containers:
                  </Typography>
                  <ul
                    style={{
                      listStyleType: "none",
                    }}
                    className={styles.containerWrap}
                  >
                    {envResource.container.map((container) => (
                      <li key={container.name}>
                        <NoiseControlOffIcon
                          sx={{
                            color: "#88a4da",
                          }}
                        />
                        <Typography variant="h3">Name:</Typography>
                        <p className={styles.containerNameWrapper}>
                          <Tooltip title={container.name || ""}>
                            <span className={styles.containerName}>{container.name}</span>
                          </Tooltip>
                          <Tooltip title="Container Logs">
                            <img className={styles.containerImg} src="/img/application/panel/env/logs.png"
                                 alt="container log"
                                 onClick={() => {
                                   setLogsParams({
                                     container_name: envResource.name,
                                     resource_name: container.name,
                                     resource_type: envResource.type,
                                     org_id: getOriIdByContext(),
                                     app_id: getQuery("app_id"),
                                     env_id: getQuery("env_id"),
                                   })
                                   setLogVisible(true);
                                 }}
                            />
                          </Tooltip>
                        </p>
                        <NoiseControlOffIcon
                          sx={{
                            color: "#88a4da",
                          }}
                        />
                        <Typography variant="h3">Image:</Typography>
                        <Tooltip title={container.image || ""}>
                          <p>{container.image}</p>
                        </Tooltip>
                      </li>
                    ))}
                  </ul>
                </Resource>
              ),
            },
          ]}
          hoverTools={<HoverTools env={props.env} resource={envResource}/>}
        />
      ))}

      {
        logVisible &&
        <WorkloadLog {...{
          setLogVisible,
          logVisible,
          logsParams
        }}/>
      }
    </ul>
  );
}

function composeIcon(icon: ReactElement) {
  return (
    <div
      style={{
        paddingLeft: "10px",
        paddingRight: "10px",
      }}
    >
      {icon}
    </div>
  );
}
