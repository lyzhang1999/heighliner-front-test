import React, {createContext, useEffect, useState} from "react";

import styles from './index.module.scss';
import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";


export default function Newpanel() {

  useEffect(() => {

  }, []);

  return (
    <Layout notStandardLayout pageHeader="applications/my shop">
      <div>
        <RepoList/>
      </div>
    </Layout>
  )
}

// http://localhost/zhangze-9n6qd/applications/newpanel
