import React, { useEffect, useRef, useState } from "react";
import { cloneDeep, get, has, omit, set } from "lodash-es";
import $$ from "dodollar";

import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Main from "@/components/Panel/Env/Main";
import SlideTabs from "@/basicComponents/CustomTab/SlideTabs";
import Resources from "@/components/Panel/Env/Resources";
import {
  ApplicationStatus,
  getApplicationStatus,
  ResourceType,
} from "@/api/application";
import useApplication from "@/hooks/application";
import { getCluster } from "@/api/cluster";
import useEnv from "@/hooks/env";
import { getOrganizationNameByUrl, getQuery } from "@/utils/utils";
import { IEnvContext, EnvContext } from "@/utils/contexts";
import { useApplicationRepos } from "@/hooks/applicationRepos";
import { useEnvProd } from "@/hooks/envProd";
import {
  getArgoCDInfo,
  GetArgoCDInfoRes,
  updateArgoCDInfo,
} from "@/api/application/argo";

import styles from "./index.module.scss";
import { Breadcrumbs, Link, Skeleton, Typography } from "@mui/material";
import { useRouter } from "next/router";

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
  const router = useRouter();

  const [envContext, setEnvContext] = useState<IEnvContext>({
    argoCDAutoSync: false,
  });
  const envContextRef = useRef(envContext);
  const argoCDReadyRef = useRef(false);

  const app_id = +getQuery("app_id");
  const env_id = +getQuery("env_id");
  const release_id = +getQuery("release_id");

  const [repos] = useApplicationRepos(getQuery("app_id"));
  const [envProd] = useEnvProd(+app_id);

  const [env] = useEnv({
    app_id,
    env_id,
  });

  // Get the kubeconfig
  const [application] = useApplication({ app_id: +app_id });
  useEffect(() => {
    if (application && application.cluster_id > 0) {
      getCluster({
        cluster_id: application.cluster_id,
      }).then((res) => {
        setEnvContext((preState) => {
          const nextState = {
            ...cloneDeep(preState),
            cluster_id: application.cluster_id,
            kubeconfig: res.kubeconfig,
          };
          envContextRef.current = nextState;
          return nextState;
        });
      });
    }
  }, [application]);

  // Manage ArgoCD information.
  function changeArgoCDAutoSync(): Promise<boolean> {
    return new Promise(async (resolve, reject) => {
      const envContext = envContextRef.current;

      let argoCDInfoOnlySpace: Pick<GetArgoCDInfoRes, "space">;

      if (envContext.argoCDInfo && envContext.argoCDInfo.space) {
        if (envContext.argoCDAutoSync === true) {
          // Close it.
          argoCDInfoOnlySpace = operateAutomatedProperty(
            { space: envContext.argoCDInfo.space }!,
            "remove"
          );
        } else {
          // Open it.
          argoCDInfoOnlySpace = operateAutomatedProperty(
            { space: envContext.argoCDInfo.space }!,
            "append"
          );
        }
        try {
          await updateArgoCDInfo({
            app_id,
            env_id,
            body: argoCDInfoOnlySpace,
          });

          setEnvContext((preState) => {
            const nextState = {
              ...cloneDeep(preState),
              argoCDAutoSync: !preState.argoCDAutoSync,
            };
            envContextRef.current = nextState;
            return nextState;
          });

          resolve(true);
        } catch (error) {
          reject(error);
        }
      }
    });
  }

  const flushArgoCDInfo = async () => {
    // Must waiting the application status not to be processing status.
    if (argoCDReadyRef.current === false) {
      const res = await getApplicationStatus({
        app_id,
        release_id,
      });

      if (res.status !== ApplicationStatus.PROCESSING) {
        argoCDReadyRef.current = true;
      } else {
        argoCDReadyRef.current = false;
        return;
      }
    }

    getArgoCDInfo({
      app_id,
      env_id,
    }).then((res) => {
      // If property `automated` exist, then ArgoCD Auto Sync is opening.
      let argoCDAutoSyncNextState = false;
      if (has(res, ["space", "syncPolicy", "automated"])) {
        argoCDAutoSyncNextState = true;
      }
      setEnvContext((preState) => {
        const nextState = {
          ...cloneDeep(preState),
          argoCDInfo: res,
          argoCDAutoSync: argoCDAutoSyncNextState,
        };
        envContextRef.current = nextState;
        return nextState;
      });
    });
  };

  useEffect(() => {
    flushArgoCDInfo();

    setEnvContext((preState) => {
      const nextState = { 
        ...cloneDeep(preState),
        changeArgoCDAutoSync,
        argoCDReadyRef
      };
      envContextRef.current = nextState;
      return nextState;
    });

    const timer = setInterval(flushArgoCDInfo, 5000);
    $$.fold(router);

    return () => clearInterval(timer);
  }, []);

  return (
    <Layout
      notStandardLayout
      breadcrumbs={{
        back: router.back,
        ele: (
          <Breadcrumbs separator="›">
            <Link
              onClick={() =>
                router.push(
                  `/${encodeURIComponent(
                    getOrganizationNameByUrl()
                  )}/applications`
                )
              }
              underline="hover"
              color="inherit"
              sx={{
                cursor: "pointer",
                fontSize: "25px",
                fontFamily: "OpenSans",
              }}
            >
              Applications
            </Link>
            <Link
              onClick={() =>
                router.push({
                  pathname: `/${encodeURIComponent(
                    getOrganizationNameByUrl()
                  )}/applications/panel`,
                  query: {
                    app_id: router.query.app_id,
                  },
                })
              }
              underline="hover"
              color="inherit"
              sx={{
                cursor: "pointer",
                fontSize: "25px",
                fontFamily: "OpenSans",
              }}
            >
              {application?.name || <Skeleton variant="text" width={100} />}
            </Link>
            <Typography
              color={"text.primary"}
              sx={{
                fontSize: "25px",
                fontFamily: "OpenSans",
              }}
            >
              {get(env, "name", "") || <Skeleton variant="text" width={100} />}
            </Typography>
          </Breadcrumbs>
        ),
      }}
    >
      <EnvContext.Provider value={envContext}>
        <div className={styles.wrapper}>
          <div className={styles.main}>
            <Main {...{ env }} />
            <SlideTabs<ResourceType>
              {...{ tabItems, selectedTab, setSelectedTab }}
            />
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
                  // envDetails: env?.setting.application.service,
                  git_provider_id: envProd.git_provider_id,
                  head_name: env?.name,
                }}
              />
            )}
          </div>
        </div>
      </EnvContext.Provider>
    </Layout>
  );
}

function operateAutomatedProperty(
  argoCDInfo: Pick<GetArgoCDInfoRes, "space">,
  operate: "remove" | "append"
) {
  switch (operate) {
    case "remove":
      return omit(argoCDInfo, "space.syncPolicy.automated");
    case "append":
      const newArgoCDInfo = cloneDeep(argoCDInfo);
      return set(newArgoCDInfo, "space.syncPolicy.automated", {});
  }
}
