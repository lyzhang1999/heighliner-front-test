import styles from "./index.module.scss";
import {useEffect, useState} from "react";
import clsx from "clsx";
import {AppRepoRes, getPrList, GetPrRes} from "@/api/application";
import {get, isEmpty, without} from "lodash-es";

interface Props {
  repoList: AppRepoRes[],
  git_provider_id: string
}

export default function RepoList({repoList, git_provider_id}: Props) {
  const [sepredIndex, setSepredIndex] = useState<number[]>([0]);
  let [prList, setPrList] = useState<GetPrRes[]>([]);

  const spread = (index: number) => {
    if (sepredIndex.includes(index)) {
      setSepredIndex(without(sepredIndex, index))
    } else {
      setSepredIndex([...sepredIndex, index]);
    }
  }

  useEffect(() => {
    let arr: Promise<any>[] = [];
    repoList.map(item => {
      let params = {
        owner_name: item.git_organization,
        git_provider_id: git_provider_id,
        repo_name: item.repo_name
      }
      arr.push(getPrList(params));
    })
    Promise.all(arr).then(res => {
      setPrList(res);
    })
  }, [])

  return (
    <div className={styles.repolist}>
      {
        repoList.map((item, index) => {
          return (
            <div className={
              clsx(styles.reopItem, (sepredIndex.includes(index)) && styles.spreadItem)
            } key={index}>
              <div className={styles.header} onClick={() => {
                // window.open(item.repo_url)
                spread(index)
              }}>
                <img src="/img/gitprovider/GITHUB.svg" alt="" className={styles.githubIcon}
                />
                <div className={styles.name}
                >
                  {item.repo_name}
                </div>
                <img src="/img/application/panel/link4.svg" alt=""
                     onClick={(e) => {
                       window.open(item.repo_url);
                       e.stopPropagation()
                     }}
                />
                {/*<OpenInNewIcon onClick={(e) => {*/}
                {/*  window.open(item.repo_url);*/}
                {/*  e.stopPropagation()*/}
                {/*}}/>*/}
                <img src="/img/application/panel/spread.svg" alt=""
                     className={clsx(styles.spreadIcon)}
                />
              </div>
              <div className={clsx(styles.content, (sepredIndex.includes(index)) && styles.spreadContent)}>
                <div className={styles.title}>
                  Pull Requests
                </div>
                {
                  isEmpty(get(prList, index, [])) &&
                  <div className={styles.empty}>No Pull Request</div>
                }
                {
                  ((get(prList, index, [])) as Array<GetPrRes>).map((v, i) => {
                    return (
                      <div className={styles.list} key={i} onClick={() => {
                        window.open(v.html_url)
                      }}>
                        <span className={styles.key}
                              title={get(v, 'head.ref', '')}>#{v.number} {get(v, 'head.ref', '')}</span>
                        <span className={styles.value} title={v.title}>
                           {v.title}
                        </span>
                      </div>
                    )
                  })
                }
                {/*<div className={styles.title}>*/}
                {/*  Commits(main)*/}
                {/*</div>*/}
                {/*{*/}
                {/*  item.commits.map((v, i) => {*/}
                {/*    return (*/}
                {/*      <div className={styles.list} key={i}>*/}
                {/*        <span className={styles.keyCommit}>*/}
                {/*          <img src="/img/application/panel/link2.svg" alt=""*/}
                {/*               className={styles.commitIcon}/>*/}
                {/*          {v.key}</span>*/}
                {/*        <span className={styles.value}>*/}
                {/*          {v.value}*/}
                {/*        </span>*/}
                {/*      </div>*/}
                {/*    )*/}
                {/*  })*/}
                {/*}*/}
                {/*<div className={styles.title}>*/}
                {/*  Branches*/}
                {/*  <img src="/img/application/panel/branch.svg" alt="" className={styles.branch}/>*/}
                {/*</div>*/}
                {/*{*/}
                {/*  item.branchs.map((v, i) => {*/}
                {/*    return (*/}
                {/*      <div className={styles.list} key={i}>*/}
                {/*        <div className={styles.branchKey}>*/}
                {/*          <img src="/img/application/panel/link3.svg" alt=""*/}
                {/*               className={styles.branchIcon}/>*/}
                {/*          {v.key}</div>*/}
                {/*        <div className={styles.value}>*/}
                {/*          <img src="/img/application/panel/link2.svg" alt=""*/}
                {/*               className={styles.valueBranchIcon}/>*/}
                {/*          {v.value}*/}
                {/*        </div>*/}
                {/*      </div>*/}
                {/*    )*/}
                {/*  })*/}
                {/*}*/}
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
