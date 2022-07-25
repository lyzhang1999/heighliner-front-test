import styles from "./index.module.scss";
import { Fragment, useState } from "react";
import clsx from "clsx";
import { EnvList as IEnvList } from "@/api/application";
import RightDrawer from "@/basicComponents/RightDrawer";
import ForkNewEnv from "./ForkNewEnv";

export const itemClass = "CANVASITME";

interface Props {
  spreadCb: () => void;
  envlist: IEnvList[];
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
      {envlist.map((i, index) => {
        return (
          <Fragment key={index}>
            <div
              key={index}
              className={clsx(
                styles.item,
                itemClass,
                index === spreadIndex && styles.spreadItem
              )}
            >
              <div
                className={styles.prevewWrapper}
                onClick={() => {
                  window.open("http://" + i.domain);
                }}
              >
                <img src="/img/application/panel/preview.svg" alt="" />
                <span className={styles.preview}>Preview</span>
              </div>
              <div className={styles.star}></div>
              {/*<img src="/img/application/panel/spreadItem.svg" alt="" className={styles.spreadIcon}*/}
              {/*     onClick={() => spread(index)}/>*/}
              <div className={styles.header}>
                <div className={styles.envName}>{i.name}</div>
                <div className={styles.iconWrapper}>
                  <img src="/img/cluster/aws.webp" alt="" />
                </div>
              </div>
              <div className={styles.urlTitle}>PUBLIC URL:</div>
              <div className={styles.url}>{i.domain}</div>
              <div className={styles.infoWrapper}>
                <div className={styles.statusWrapper}>
                  <span className={styles.key}>Status:</span>
                  <span className={styles.value}>
                    <span className={styles.circle}></span>
                    <span className={styles.statusValue}>Creating</span>
                  </span>
                </div>
                <div className={styles.configWrapper}>
                  <span className={styles.key}>Configs:</span>
                  <span className={styles.configValue}>main/values.yaml</span>
                </div>
                <div className={styles.logsWrapper}>
                  <span className={styles.key}>Logs:</span>
                  <span className={styles.logsValue}>Deploy</span>
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
