import { Avatar } from "@mui/material";
import React from "react";
import { useRouter } from "next/router";
import { get } from "lodash-es";

import GitHubIcon from "@mui/icons-material/GitHub";
import { GetEnvRes } from "@/api/application";
import Link from "/public/img/application/panel/env/link.svg";
import Config from "/public/img/application/panel/env/config.svg";
import Gear from "/public/img/application/panel/env/gear.svg";
import { getQuery, getUrlEncodeName } from "@/utils/utils";

import styles from "./index.module.scss";

export default function Main(props: any): React.ReactElement {
  const { env } = props;
  const router = useRouter();

  return (
    <div className={styles.wrapper}>
      <div className={styles.titleWrap}>
        {/* <div>hammer</div> */}
        <h1>{env?.name}</h1>
      </div>
      <div className={styles.infoWrap}>
        {/* {[1, 2, 3, 4, 5].map((v) => (
          <Avatar
            src=""
            alt=""
            key={v}
            sx={{
              width: 20,
              height: 20,
            }}
          />
        ))} */}
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
      </div>
      <div className={styles.publicUrlWrap}>
        <h2>public url</h2>
        <p>
          {/* https://bd603175-3825-4e31-b259-49d9550079a1-hongchao-heighliner.forkmain */}
          {"http://" + env?.domain}
          <span
            onClick={() => {
              window.open("http://" + env?.domain);
            }}
          >
            <Link />
          </span>
          {/* <Avatar
            src=""
            alt=""
            sx={{
              width: 20,
              height: 20,
            }}
          /> */}
        </p>
      </div>
      <div className={styles.issuesWrap}>
        {/* <h3>issues</h3>
        <p>
          [Bug]: On AWS ingress-nginx will provide hostname instead of an ip
          address{" "}
          <Avatar
            src=""
            alt=""
            sx={{
              width: 20,
              height: 20,
            }}
          />
        </p>
        <p>
          [Bug]: On AWS ingress-nginx will provide hostname instead of an ip
          address{" "}
          <Avatar
            src=""
            alt=""
            sx={{
              width: 20,
              height: 20,
            }}
          />
        </p> */}
      </div>
      <div className={styles.statusWrap}>
        <h3>status</h3>
        <span></span>
        Running
      </div>
      <div className={styles.branchWrap}>
        {/* <GitHubIcon />
        <h3>branch</h3>
        <p>Initial commits created from https://....</p> */}
      </div>
    </div>
  );
}