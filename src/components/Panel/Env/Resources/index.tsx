import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
} from "react";
import clsx from "clsx";
import ApiIcon from "@mui/icons-material/Api";
import DeviceHubIcon from "@mui/icons-material/DeviceHub";

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
import { Typography } from "@mui/material";
import { ResourceType } from "@/api/application";

interface Props extends CommonProps {
  env: any;
  selectedResourceType: ResourceType;
}

export default function Resources(props: Props): React.ReactElement {
  const [envResources, flushEnvResources] = useEnvResources({
    app_id: +getQuery("app_id"),
    env_id: +getQuery("env_id"),
  });

  useEffect(() => {
    flushEnvResources({
      resource_type: props.selectedResourceType,
    });
  }, [props.selectedResourceType]);

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
                      fontSize: "14px",
                      marginTop: "6.5px",
                    }}
                  >
                    Docker Images:
                  </Typography>
                  <ul
                    style={{
                      listStyleType: "none",
                    }}
                  >
                    {envResource.container.map((container) => (
                      <li
                        key={container.name}
                        style={{
                          margin: "10px",
                          padding: "2px",
                          backgroundColor: "",
                          display: "grid",
                          gridTemplateColumns: "auto 1fr",
                          gridTemplateRows: "auto auto",
                          columnGap: "2px",
                          rowGap: "2px",
                        }}
                      >
                        <ApiIcon />
                        Name:&nbsp;{container.name}
                        <DeviceHubIcon />
                        Image:&nbsp; {container.image}
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
