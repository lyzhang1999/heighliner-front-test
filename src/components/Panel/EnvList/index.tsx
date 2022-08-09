import {get} from "lodash-es";
import clsx from "clsx";
import React, {Fragment, useState} from "react";
import LinkIcon from '@mui/icons-material/Link';
import {useRouter} from "next/router";
import SettingsIcon from '@mui/icons-material/Settings';
import { Link as MUILink, Skeleton } from "@mui/material";

import RightDrawer from "@/basicComponents/RightDrawer";
import {EnvItemRes, ForkRes, StatusColor} from "@/api/application";
import {formatDate, getQuery, getUrlEncodeName} from "@/utils/utils";

import styles from "./index.module.scss";
import ForkNewEnv from "./ForkNewEnv";
import Link from "/public/img/application/panel/env/link.svg";

export const itemClass = "CANVASITME";

interface Props {
  spreadCb: () => void,
  envlist: EnvItemRes[],
  forkSuccessCb?: (res: ForkRes) => void;
}

export default function EnvList({spreadCb, envlist, forkSuccessCb}: Props) {
  const [spreadIndex, setSpreadIndex] = useState<number>(-1);
  const [modalDisplay, setModalDisplay] = useState(false);
  const router = useRouter();
  const app_id = getQuery("app_id");
  const release_id = getQuery("release_id");

  const spread = (index: number) => {
    spreadCb();
    if (spreadIndex === index) {
      setSpreadIndex(-1);
    } else {
      setSpreadIndex(index);
    }
  };

  const openForkNewEnvDrawer = () => {
    setModalDisplay(true);
  };

  const goEnvDetailPage = function (env_id: string | number) {
    return () => {
      const app_id = getQuery("app_id");
      const release_id = getQuery("release_id");
      router.push(
        `/${getUrlEncodeName()}/applications/panel/env?app_id=${app_id}&release_id=${release_id}&env_id=${env_id}`
      );
    }
  }

  return (
    <div className={styles.wrapper}>
      {
        (!envlist || envlist.length <= 0) && (
          <Skeleton variant="rectangular" width={500} height={100} sx={{marginTop: "50px"}} />
        )
      }
      {
        envlist.map((i, index) => {
          return (
            <Fragment key={index}>
              <div key={index} className={clsx(styles.item, itemClass,
                (index === spreadIndex) && styles.spreadItem
              )}>
                <div className={styles.previewWrapper}
                     style={{
                       right: '175px',
                       top: '-31px',
                       color: "#1b51b9",
                     }}
                     onClick={() => {
                       const env_id = i.application_env_id;
                       router.push(
                         `/${getUrlEncodeName()}/applications/panel/env/settings?app_id=${app_id}&release_id=${release_id}&env_id=${env_id}`
                       );
                     }}
                >
                  <SettingsIcon />
                  <span className={styles.preview}>
                    &nbsp;Settings
                  </span>
                </div>
                <div className={styles.previewWrapper}
                     style={{
                       right: '91px',
                       top: '-31px',
                       color: "#1b51b9",
                     }}
                     onClick={goEnvDetailPage(i.application_env_id)}
                >
                  <LinkIcon/>
                  <span className={styles.preview}>
                    &nbsp;Details
                  </span>
                </div>
                <div className={styles.previewWrapper} onClick={() => {
                  window.open("http://" + i.domain)
                }}>
                  <img src="/img/application/panel/preview.svg" alt=""/>
                  <span className={styles.preview}>
                  Preview
                </span>
                </div>
                <div className={styles.star}></div>
                <div className={styles.header} >
                  <div 
                    className={styles.envName}
                    onClick={goEnvDetailPage(i.application_env_id)}
                  >{i.name}</div>
                </div>
                <div className={styles.previewURLWrap}>
                  Preview URL:
                  <MUILink href={`http://${i.domain}`} target="_blank" rel="noreferrer" >http://{i.domain}{" "}<Link/></MUILink>
                </div>
                {
                  i.github_issues && i.github_issues.length >= 1 && (
                    <div className={styles.issuesWrap}>
                      Issue:
                      <MUILink>{i.github_issues[0]}</MUILink>
                    </div>
                  )
                }
                <div className={styles.infoWrapper}>
                  <div className={styles.statusWrapper}>
                  <span className={styles.key}>
                      Status:
                  </span>
                    <span className={styles.value}>
                    <span className={styles.circle}
                          style={{backgroundColor: get(StatusColor, get(i, 'last_release.status', ''), 'red')}}
                    ></span>
                    <span className={styles.statusValue}>{get(i, 'last_release.status', '')}</span>
                  </span>
                  </div>
                  <div className={styles.configWrapper}>
                   <span className={styles.key}>
                      Configs:
                   </span>
                    <span className={styles.configValue} onClick={() => {
                      let url = get(i, 'setting.application.deploy.url', '');
                      let valueName = get(i, 'setting.application.deploy.values_file', '');
                      let name = i.name;
                      let path = get(i, 'setting.application.deploy.path', '');
                      window.open(`${url}/tree/main/${path}/${valueName}`)
                    }}>
                      {
                        get(i, 'setting.application.deploy.values_file', '')
                      }
                  </span>
                  </div>
                  <div className={styles.logsWrapper}>
                   <span className={styles.key}>
                      Logs:
                  </span>
                    <span className={styles.logsValue}
                          onClick={() => {
                            router.push(`/${getUrlEncodeName()}/applications/creating?app_id=${getQuery('app_id')}&release_id=${get(i, 'last_release.id', '')}&foromPane=true`);
                          }}
                    >
                    Deploy
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
                  <img src="/img/application/panel/forkenv.svg" alt=""/>
                  <span className={styles.desc}>Fork an new environment</span>
                  <RightDrawer
                    {...{
                      title: "Fork an Environment From Main",
                      modalDisplay,
                      setModalDisplay,
                      width: "700px",
                    }}
                  >
                    <ForkNewEnv {...{
                      forkSuccessCb: (res) => {
                        setModalDisplay(false);
                        forkSuccessCb && forkSuccessCb(res);
                      }
                    }}/>
                  </RightDrawer>
                </div>
              )}
            </Fragment>
          );
        })}
    </div>
  );
}
