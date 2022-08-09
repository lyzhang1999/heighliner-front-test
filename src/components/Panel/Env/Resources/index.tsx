import React, {
  ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";
import NoiseControlOffIcon from "@mui/icons-material/NoiseControlOff";

import { CommonProps } from "@/utils/commonType";
import LeftSideTabs from "@/basicComponents/CustomTab/LeftSideTabs";
import Folder from "/public/img/application/panel/env/git.svg";
import Git from "/public/img/application/panel/env/folder.svg";
import Server from "/public/img/application/panel/env/server.svg";
import Docker from "/public/img/application/panel/env/docker.svg";
import Paper from "/public/img/application/panel/env/paper.svg";
import { getQuery } from "@/utils/utils";
import HoverTools from "./HoverTools";
import useEnvResources from "@/hooks/envResources";

import styles from "./index.module.scss";
import Resource from "./Resource";
import { Tooltip, Typography } from "@mui/material";
import { ResourceType } from "@/api/application";
import { $$ } from "@/utils/console";

interface Props extends CommonProps {
  env: any;
  selectedResourceType: ResourceType;
}

export default function Resources(props: Props): React.ReactElement {
  const [envResources, flushEnvResources] = useEnvResources({
    app_id: +getQuery("app_id"),
    env_id: +getQuery("env_id"),
  });
  const [timer, setTimer] = useState<ReturnType<typeof setInterval>>();
  const timerRef = useRef<ReturnType<typeof setInterval>>();

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
                        <Tooltip title={container.name || ""}>
                          <p>{container.name}</p>
                        </Tooltip>
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
          hoverTools={<HoverTools env={props.env} resource={envResource} />}
        />
      ))}
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
