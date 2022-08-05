import React, { useContext, useEffect, useState } from "react";
import { get } from "lodash-es";

import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Main from "@/components/Panel/Env/Main";
import SlideTabs from "@/basicComponents/CustomTab/SlideTabs";
import Resources from "@/components/Panel/Env/Resources";
import { ResourceType } from "@/api/application";
import useApplication from "@/hooks/application";
import { getCluster } from "@/api/cluster";
import useEnv from "@/hooks/env";
import { getQuery } from "@/utils/utils";
import { IEnvContext, EnvContext } from "@/utils/contexts";

import styles from "./index.module.scss";
import { PanelContext } from "..";
import { useApplicationRepos } from "@/hooks/applicationRepos";
import { useEnvProd } from "@/hooks/envProd";

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
  const [envContext, setEnvContext] = useState<IEnvContext>({});

  const app_id = getQuery("app_id");
  const env_id = getQuery("env_id");

  const [repos] = useApplicationRepos(getQuery("app_id"));
  const [envProd] = useEnvProd(+app_id);

  const [env] = useEnv({
    app_id: +app_id,
    env_id: +env_id,
  });

  // Get the kubeconfig
  const [application] = useApplication({ app_id: +app_id });
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
    <Layout
      notStandardLayout
      pageHeader={`Applications / ${application?.name || ""} / ${get(
        env,
        "name",
        ""
      )}`}
    >
      <EnvContext.Provider value={envContext}>
        <div className={styles.wrapper}>
          <div className={styles.main}>
            <Main env={env} />
            <SlideTabs<ResourceType>
              {...{ tabItems, selectedTab, setSelectedTab }}
            />
            {/* <Projects /> */}
            <Resources
              {...{
                env,
                selectedResourceType: selectedTab as ResourceType,
              }}
            />
          </div>
          <div>
            {repos && repos.length > 0 && envProd && envProd.git_provider_id && (
              <RepoList
                {...{
                  repoList: repos,
                  envDetails: env?.setting.application.service,
                  git_provider_id: envProd.git_provider_id,
                  base_name: env?.name,
                }}
              />
            )}
          </div>
        </div>
      </EnvContext.Provider>
    </Layout>
  );
}
