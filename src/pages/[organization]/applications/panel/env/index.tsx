import React, { createContext, useEffect, useState } from "react";

import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Main from "@/components/Panel/Env/Main";

import SlideTabs from "@/basicComponents/CustomTab/SlideTabs";
// import Projects from "@/components/Panel/Env/Projects";
import Resources from "@/components/Panel/Env/Resources";

import styles from "./index.module.scss";
import { ResourceType } from "@/api/application";
import useApplication from "@/hooks/application";
import { getQuery } from "@/utils/utils";
import { getCluster } from "@/api/cluster";

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

interface IEnvContext {
  cluster_id?: number;
  kubeconfig?: string;
}

export const EnvContext = createContext<IEnvContext>({});

export default function Env(): React.ReactElement {
  const [selectedTab, setSelectedTab] = useState(tabItems[0].label);
  const [envContext, setEnvContext] = useState<IEnvContext>({});

  // Get the kubeconfig
  const app_id = +getQuery("app_id");
  const [application] = useApplication({ app_id });
  useEffect(() => {
    if (application && application.cluster_id > 0) {
      getCluster({
        cluster_id: application.cluster_id,
      }).then((res) => {
        setEnvContext((preState) => ({
          ...preState,
          cluster_id: application.cluster_id,
          kubeconfig: res.kubeconfig,
        }));
      });
    }
  }, [application]);

  return (
    <Layout notStandardLayout pageHeader="applications/my shop">
      <EnvContext.Provider value={envContext}>
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
      </EnvContext.Provider>
    </Layout>
  );
}
