import styles from './index.module.scss';
import {Fragment, useState} from "react";
import clsx from "clsx";
import {EnvList as IEnvList} from "@/api/application";
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


const envList = [item, item, item, item];

interface Props {
  spreadCb: () => void,
  envlist: IEnvList[],
}

export default function EnvList({spreadCb, envlist}: Props) {
  const [sepredIndex, setSepredIndex] = useState<number>(-1);
  const spread = (index: number) => {
    spreadCb();
    if (sepredIndex === index) {
      setSepredIndex(-1)
    } else {
      setSepredIndex(index);
    }
  }
  return (
    <div className={styles.wrapper}>
      {
        envlist.map((i, index) => {
          return (
            <Fragment key={index}>
              <div key={index} className={clsx(styles.item, itemClass,
                (index === sepredIndex) && styles.spreadItem
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
                      window.open(`${url}/tree/${name}/${path}/${valueName}`)
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
                {/*<div className={styles.hiddenWrapper}>*/}
                {/*  <div className={styles.urlTitle}>*/}
                {/*    Pull requests:*/}
                {/*  </div>*/}
                {/*  {*/}
                {/*    i.pr.map((item) => {*/}
                {/*      return <div key={item} className={styles.prItem}>{item}</div>*/}
                {/*    })*/}
                {/*  }*/}
                {/*  <div className={styles.urlTitle}>*/}
                {/*    Releases:*/}
                {/*  </div>*/}
                {/*  {*/}
                {/*    i.issue.map((item) => {*/}
                {/*      return <div key={item} className={styles.issueItem}>{item}</div>*/}
                {/*    })*/}
                {/*  }*/}
                {/*</div>*/}
              </div>
              {
                index === 0 &&
                <div className={clsx(styles.forkEnv, itemClass)}>
                  <div className={styles.star}></div>
                  <img src="/img/application/panel/forkenv.svg" alt=""/>
                  <span className={styles.desc}>
                      Fork a new environment
                    </span>
                </div>
              }
            </Fragment>
          )
        })
      }
    </div>
  )
}
