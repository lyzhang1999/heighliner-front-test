import React, {createContext, useEffect, useState} from "react";

import styles from './index.module.scss';
import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Canvas from "@/pages/[organization]/applications/panel/canvas";
import EnvList, {itemClass} from "@/components/Panel/EnvList";
import {reduce} from "lodash-es";
import {getQuery} from "@/utils/utils";
import {getEnvs} from "@/api/application";


export default function Newpanel() {
  const [arrList, setArrList] = useState([]);
  let appId = getQuery("app_id")

  const [envlist, setEnvList] = useState([]);
  useEffect(() => {
    getEnvs(appId).then(res => {
      console.warn(res)
      setEnvList(res);
    })
  }, [])
  useEffect(() => {
    setTimeout(() => {
      getPosition()
    }, 1000)
  }, []);

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
        <EnvList spreadCb={spreadCb} envlist={envlist}/>
        {/*</div>*/}
        {/*<div className={styles.right}>*/}
        <RepoList/>
        {/*</div>*/}
      </div>
    </Layout>
  )
}

// http://localhost/zhangze-9n6qd/applications/newpanel
