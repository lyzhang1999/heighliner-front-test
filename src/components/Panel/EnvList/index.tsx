import styles from "./index.module.scss";
import { Fragment, useState } from "react";
import clsx from "clsx";
import RightDrawer from "@/basicComponents/RightDrawer";
import ForkNewEnv from "./ForkNewEnv";
import {EnvListRes} from "@/api/application";
import {get} from "lodash-es";

const item =
  {
    envName: "Main",
    pubulicUrl: "https://bd603175-3825-4e31-b259-49d9550079a1-hongchao-heighliner.forkmain",
    status: 'Creating',
    config: "",
    logs: "",
    pr: ['feat: Validate against nested core actions #777', 'build(deps): bump @docusaurus/core from 2.0.0-beta.21 to 2.0.0-beta.22 in....'],
    issue: ['Refactor core.#Stop and core.#SendSignal to not reference core.#Start directly', 'Refactor core.#Stop and core.#SendSignal to not reference core.']
  }

export const itemClass = "CANVASITME";

interface Props {
  spreadCb: () => void,
  envlist: EnvListRes[],
}

export default function EnvList({ spreadCb, envlist }: Props) {
  const [spreadIndex, setSpreadIndex] = useState<number>(-1);
  const [modalDisplay, setModalDisplay] = useState(false);

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
  return (
    <div className={styles.wrapper}>
      {
        envlist.map((i, index) => {
          return (
            <Fragment key={index}>
              <div key={index} className={clsx(styles.item, itemClass,
                (index === spreadIndex) && styles.spreadItem
              )}>
                <div className={styles.prevewWrapper} onClick={() => {
                  window.open("http://" + i.domain)
                }}>
                  <img src="/img/application/panel/preview.svg" alt=""/>
                  <span className={styles.preview}>
                  Preview
                </span>
                </div>
                <div className={styles.star}></div>
                {/*<img src="/img/application/panel/spreadItem.svg" alt="" className={styles.spreadIcon}*/}
                {/*     onClick={() => spread(index)}/>*/}
                <div className={styles.header}>
                  <div className={styles.envName}>{i.name}</div>
                  {/*<div className={styles.iconWrapper}>*/}
                  {/*  <img src="/img/cluster/aws.webp" alt=""/>*/}
                  {/*</div>*/}
                </div>
                <div className={styles.urlTitle}>
                  PUBLIC URL:
                </div>
                <div className={styles.url}>
                  {i.domain}
                </div>
                <div className={styles.infoWrapper}>
                  <div className={styles.statusWrapper}>
                  <span className={styles.key}>
                      Status:
                  </span>
                    <span className={styles.value}>
                    <span className={styles.circle}></span>
                    <span className={styles.statusValue}>Running</span>
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
                            window.open(location.href.replace('panel', 'creating') + '&foromPane=true')
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
                <img src="/img/application/panel/forkenv.svg" alt="" />
                <span className={styles.desc}>Fork a new environment</span>
                <RightDrawer
                  {...{
                    title: "Fork an Environment From Main",
                    modalDisplay,
                    setModalDisplay,
                  }}
                >
                  <ForkNewEnv />
                </RightDrawer>
              </div>
            )}
          </Fragment>
        );
      })}
    </div>
  );
}
