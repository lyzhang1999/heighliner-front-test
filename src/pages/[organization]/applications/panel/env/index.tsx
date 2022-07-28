import React, { createContext, useState } from "react";

import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Main from "@/components/Panel/Env/Main";

import SlideTabs from "@/basicComponents/CustomTab/SlideTabs";
// import Projects from "@/components/Panel/Env/Projects";
import Resources from "@/components/Panel/Env/Resources";

import styles from "./index.module.scss";
import { ResourceType } from "@/api/application";

const tabItems: Array<{
  label: ResourceType;
}> = [
  {
    label: "All",
  },
  {
    label: "Deployment",
  },
  {
    label: "StatefulSet",
  },
  {
    label: "DaemonSet",
  },
  {
    label: "Job",
  },
  {
    label: "CronJob",
  },
];

export default function Env(): React.ReactElement {
  const [selectedTab, setSelectedTab] = useState(tabItems[0].label);

  return (
    <Layout notStandardLayout pageHeader="applications/my shop">
      <div className={styles.wrapper}>
        <div className={styles.main}>
          <Main />
          <SlideTabs {...{ tabItems, selectedTab, setSelectedTab }} />
          {/* <Projects /> */}
          <Resources
            {...{
              selectedResourceType: selectedTab as ResourceType,
            }}
          />
        </div>
        {/* <RepoList /> */}
      </div>
    </Layout>
  );
}
