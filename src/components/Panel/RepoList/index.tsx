/* eslint-disable @next/next/no-img-element */
import styles from "./index.module.scss";
import {useEffect, useState} from "react";
import clsx from "clsx";
import { AppRepoRes, Service } from "@/api/application";
import {get, isEmpty, without} from "lodash-es";
import { getPrList, GetPrListRes } from "@/api/gitProviders";
import { Button } from "@mui/material"

interface Props {
  repoList: AppRepoRes[],
  git_provider_id: number,
  base_name?: string;
  head_name?: string;
  envDetails?: Service[],
}

export default function RepoList({repoList, envDetails, git_provider_id, base_name, head_name}: Props) {
  const [sepredIndex, setSepredIndex] = useState<number[]>([0]);
  let [prList, setPrList] = useState<GetPrListRes>([]);

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
        repo_name: item.repo_name,
        git_provider_id,
        base_name,
        head_name,
      }
      arr.push(getPrList(params));
    })
    Promise.all(arr).then(res => {
      setPrList(res);
    })
  }, [])

  const handleGithubLink = (repoUrl: string) => (e: any) => {
    e.stopPropagation()
    let branchUrl = repoUrl
    if (base_name) {
      branchUrl = `${repoUrl}/tree/${encodeURIComponent(base_name)}`
    }
    window.open(branchUrl)
  }

  const handleNewPR = (repo: AppRepoRes) => (e: any) => {
    e.stopPropagation()

    const repoSettings = envDetails?.find(item => item.name === repo.repo_name)?.setting
    const startPoint: string = repoSettings?.fork.from || 'main'
    const prUrl = `${repo.repo_url}/compare/${encodeURIComponent(startPoint)}...${encodeURIComponent(base_name || '')}`
    window.open(prUrl)
  }

  return (
    <div className={styles.repolist}>
      {
        repoList.map((item, index) => {
          return (
            <div className={
              clsx(styles.reopItem, (sepredIndex.includes(index)) && styles.spreadItem)
            } key={index}>
              <div className={styles.header} onClick={() => {
                spread(index)
              }}>
                <img src="/img/gitprovider/GITHUB.svg" alt="" className={styles.githubIcon}
                />
                <div className={styles.name}
                >
                  {item.repo_name}
                </div>
                <img
                  alt=""
                  src="/img/application/panel/link4.svg"
                  onClick={handleGithubLink(item.repo_url)}
                />
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
                  ((get(prList, index, [])) as GetPrListRes).map((v, i) => {
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
                {
                  base_name && (
                    <div className={styles.newPrBtn}>
                      <Button onClick={handleNewPR(item)} variant="outlined">New pull request</Button>
                    </div>
                  )
                }
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
