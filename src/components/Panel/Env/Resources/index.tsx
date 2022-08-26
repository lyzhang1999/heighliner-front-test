import React, {
  ReactElement,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

import { isEmpty } from "lodash-es";
import { DoDollar } from "dodollar";

import {
  Box,
  Skeleton,
  styled,
  Tooltip,
  Typography,
  TypographyProps,
} from "@mui/material";
import { PodStatus } from "@/api/application/env";

import { CommonProps } from "@/utils/commonType";
import LeftSideTabs from "@/basicComponents/CustomTab/LeftSideTabs";
import Docker from "/public/img/application/panel/env/docker.svg";
import { getOriIdByContext, getQuery } from "@/utils/utils";
import HoverTools from "./HoverTools";
import useEnvResources from "@/hooks/envResources";
import { $$ } from "@/utils/console";
import { EnvContext, IEnvContext } from "@/utils/contexts";
import WorkloadLog from "@/components/WorkloadLog";
import { ResourceType } from "@/api/application";

import styles from "./index.module.scss";
import Resource from "./Resource";

interface Props extends CommonProps {
  env: any;
  selectedResourceType: ResourceType;
}

export interface GetLogParams {
  container_name: string;
  pod_name: string;
  resource_name: string;
  resource_type: ResourceType;
  org_id: string;
  app_id: string;
  env_id: string;
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

  const { argoCDReadyRef }: IEnvContext = useContext(EnvContext);

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

  return (
    <ul className={styles.wrapper}>
      {argoCDReadyRef?.current === false && isEmpty(envResources) ? (
        <>
          <Skeleton animation="wave" height={300} />
          <Skeleton animation="wave" height={300} />
        </>
      ) : (
        envResources.map((envResource) => (
          <LeftSideTabs
            key={envResource.name}
            tabs={[
              {
                icon: composeIcon(<Docker />),
                content: (
                  <Resource
                    {...{
                      envResource,
                      logsParams,
                      setLogsParams,
                      setLogVisible,
                    }}
                  />
                ),
              },
            ]}
            hoverTools={(envResource.type === "Deployment") ? <HoverTools env={props.env} resource={envResource}/> :
              <div style={{height: "42px"}}></div>}
          />
        ))
      )}
      {logVisible && (
        <WorkloadLog
          {...{
            setLogVisible,
            logVisible,
            logsParams,
          }}
        />
      )}
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

export const SubHeader = styled(Typography)<TypographyProps>(() => ({
  fontSize: 14,
  fontWeight: 500,
  display: "inline-block",
  color: "#222f42",
}));
