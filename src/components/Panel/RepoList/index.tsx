import styles from "./index.module.scss";
import {useState} from "react";
import clsx from "clsx";
import {AppRepoRes} from "@/api/application";


const item = {
  repoName: 'h8r-dev/StackHub-Backend43214321432143241oy324u321hu4o3214',
  pr: [
    {
      key: "Env-001",
      value: "#269 refactor: push code to github.."
    },
    {
      key: "Env-002",
      value: "#269 refactor: use base image.."
    }
  ],
  commits: [
    {
      key: "1c7af26 ",
      value: "(fix: update nocalhost version)"
    },
    {
      key: "1c7af27",
      value: "(fix: update nocalhost version2)"
    }
  ],
  branches: [
    {
      key: "v0.2.0 ",
      value: "1c7af26 2022/3/27"
    },
    {
      key: "v0.2.1",
      value: "1c7af26 2022/3/28"
    }
  ]
}


const list = [item, item, item, item];

interface Props {
  repoList: AppRepoRes[]
}

export default function RepoList({repoList}: Props) {
  const [sepredIndex, setSepredIndex] = useState<number>(-1);

  const spread = (index: number) => {
    if (sepredIndex === index) {
      setSepredIndex(-1)
    } else {
      setSepredIndex(index);
    }
  }

  return (
    <div className={styles.repolist}>
      {
        repoList.map((item, index) => {
          return (
            <div className={
              // styles.reopItem
              clsx(styles.reopItem, (sepredIndex === index) && styles.spreadItem)
            } key={index}>
              <div className={styles.header} onClick={() => {
                window.open(item.repo_url)
                // spread(index)
              }}>
                <img src="/img/gitprovider/GITHUB.svg" alt="" className={styles.githubIcon}/>
                <div className={styles.name}>
                  {item.repo_name}
                </div>
                {/*<img src="/img/application/panel/spread.svg" alt=""*/}
                {/*     className={clsx(styles.spreadIcon)}*/}
                {/*/>*/}
              </div>
              {/*<div className={clsx(styles.content, (sepredIndex === index) && styles.spreadContent)}>*/}
                {/*<div className={styles.title}>*/}
                {/*  Pull Requests*/}
                {/*</div>*/}
                {/*{*/}
                {/*  item.pr.map((v, i) => {*/}
                {/*    return (*/}
                {/*      <div className={styles.list} key={i}>*/}
                {/*        <span className={styles.key}>&lt;/&gt;{v.key}</span>*/}
                {/*        <span className={styles.value}>*/}
                {/*          {v.value}*/}
                {/*        </span>*/}
                {/*      </div>*/}
                {/*    )*/}
                {/*  })*/}
                {/*}*/}
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
              {/*</div>*/}
            </div>
          )
        })
      }
    </div>
  )
}
