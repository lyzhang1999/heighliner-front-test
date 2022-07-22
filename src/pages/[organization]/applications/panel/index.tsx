import React, {createContext, useEffect, useState} from "react";

import styles from './index.module.scss';
import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Canvas from "@/pages/[organization]/applications/panel/canvas";
import EnvList, {itemClass} from "@/components/Panel/EnvList";
import {reduce} from "lodash-es";
import {getQuery} from "@/utils/utils";
import {AppRepoRes, getApplicationRepos, getEnvs} from "@/api/application";

// http://localhost/zhangze-294c2/applications/panel?app_id=6&release_id=6

export default function Newpanel() {
  const [arrList, setArrList] = useState([]);
  let appId = getQuery("app_id")

  const [envlist, setEnvList] = useState([]);
  const [repoList, setRepoList] = useState<AppRepoRes[]>([]);

  useEffect(() => {
    getEnvs(appId).then(res => {
      setEnvList(res);
      setTimeout(() => {
        getPosition()
      }, 0)
    })
    getApplicationRepos(appId).then(res => {
      setRepoList(res)
    })
  }, [])

  function getPosition() {
    var item = document.querySelectorAll(`.${itemClass}`);
    let arr: number[] = [];
    Array.from(item).map((i, index) => {
      if (index === 0) {
        return;
      }
      arr.push(i.getBoundingClientRect().top - item[0].getBoundingClientRect().top)
    })
    setArrList(arr)
  }

  function spreadCb() {
    setTimeout(() => {
      getPosition();
    }, 0)
  }

  return (
    <Layout notStandardLayout pageHeader="applications/my shop">
      <div className={styles.wrapper}>
        {/*<div className={styles.left}>*/}
        <Canvas arrList={arrList}/>
        <EnvList
          {...{
            spreadCb,
            envlist
          }}
        />
        {/*</div>*/}
        {/*<div className={styles.right}>*/}
        <RepoList {...{repoList}}/>
        {/*</div>*/}
      </div>
    </Layout>
  )
}

// http://localhost/zhangze-9n6qd/applications/newpanel
