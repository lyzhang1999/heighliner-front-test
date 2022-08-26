import React, { createContext, useEffect, useState } from "react";
import { get, isEmpty } from "lodash-es";
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';
import { useRouter } from "next/router";
import {
  Breadcrumbs,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";

import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Canvas from "@/pages/[organization]/applications/panel/canvas";
import EnvList, { itemClass } from "@/components/Panel/EnvList";
import { getOrganizationNameByUrl, getQuery } from "@/utils/utils";
import {
  AppRepoRes,
  EnvItemRes, getApplicationInfo, GetApplicationInfoRes,
  getApplicationRepos,
  getEnvs,
  getProdEnv,
} from "@/api/application";
import { PanelContext, PanelContextValue } from "@/utils/contexts";

import styles from "./index.module.scss";

export default function Panel() {
  const router = useRouter();
  const [panelContextValue, setPanelContextValue] = useState<PanelContextValue>(
    {}
  );
  const [arrList, setArrList] = useState<number[]>([]);
  let appId = getQuery("app_id");

  const [envlist, setEnvList] = useState<EnvItemRes[]>([]);
  const [repoList, setRepoList] = useState<AppRepoRes>([]);
  const [appInfo, setAppInfo] = useState<GetApplicationInfoRes | null>(null);
  const [git_provider_id, setGit_provider_id] = useState<string>("");

  useEffect(() => {
    getProdEnv(appId).then((res) => {
      setGit_provider_id(String(res.git_provider_id));
      setPanelContextValue((preState) => {
        return {
          ...preState,
          git_org_name: res.git_org_name,
          git_provider_id: res.git_provider_id,
          owner_id: res.owner_id,
          prodEnvId: res.id,
        };
      });
    });
    getEnvList();
    getApplicationRepos(appId).then((res) => {
      setRepoList(res);
      setPanelContextValue((preState) => {
        return {
          ...preState,
          repos: res,
        };
      });
    });
    getApplicationInfo({app_id: appId}).then(res => {
      setAppInfo(res);
    })
  }, []);

  function getEnvList() {
    getEnvs(appId).then((res) => {
      setEnvList(res);
      setTimeout(() => {
        getPosition();
      }, 0);
    });
  }

  function forkEnvCb() {
    getEnvList();
  }

  function getPosition() {
    var item = document.querySelectorAll(`.${itemClass}`);
    let arr: number[] = [];
    Array.from(item).map((i, index) => {
      if (index === 0) {
        return;
      }
      arr.push(
        i.getBoundingClientRect().top - item[0].getBoundingClientRect().top
      );
    });
    setArrList(arr);
  }

  function spreadCb() {
    setTimeout(() => {
      getPosition();
    }, 0);
  }

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
            <Typography
              color={"text.primary"}
              sx={{
                fontSize: "25px",
                fontFamily: "OpenSans",
              }}
            >
              {get(appInfo, "name", "") || (
                <Skeleton variant="text" width={100} />
              )}
            </Typography>
          </Breadcrumbs>
        ),
      }}
    >
      <PanelContext.Provider value={panelContextValue}>
        <div className={styles.wrapper}>
          <Canvas arrList={arrList} />
          <EnvList
            {...{
              spreadCb,
              envlist,
              forkSuccessCb: forkEnvCb,
            }}
          />
          {git_provider_id && !isEmpty(repoList) && (
            <div
              style={{
                marginLeft: "20px",
                marginTop: "50px",
                marginRight: "50px",
                width: "30%",
                maxWidth: "500px",
              }}
            >
              <RepoList {...{ repoList, git_provider_id: +git_provider_id }} />
            </div>
          )}
        </div>
      </PanelContext.Provider>
    </Layout>
  );
}
