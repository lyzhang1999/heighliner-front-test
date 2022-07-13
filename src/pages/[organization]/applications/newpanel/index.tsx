import React, {createContext, useEffect, useState} from "react";

import styles from './index.module.scss';
import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Canvas from "@/pages/[organization]/applications/newpanel/canvas";
import EnvList from "@/components/Panel/EnvList";


export default function Newpanel() {

  useEffect(() => {

  }, []);

  return (
    <Layout notStandardLayout pageHeader="applications/my shop">
      <div className={styles.wrapper}>
        {/*<div className={styles.left}>*/}
          <Canvas/>
          <EnvList/>
        {/*</div>*/}
        {/*<div className={styles.right}>*/}
          <RepoList/>
        {/*</div>*/}
      </div>
    </Layout>
  )
}

// http://localhost/zhangze-9n6qd/applications/newpanel
