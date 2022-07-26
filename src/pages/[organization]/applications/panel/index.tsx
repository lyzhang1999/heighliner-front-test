import React, {createContext, useEffect, useState} from "react";

import styles from "./index.module.scss";
import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Canvas from "@/pages/[organization]/applications/panel/canvas";
import EnvList, {itemClass} from "@/components/Panel/EnvList";
import {getOriIdByContext, getQuery} from "@/utils/utils";
import {
  AppRepoRes,
  EnvListRes,
  getApplicationRepos,
  getEnvs,
  getProdEnv,
} from "@/api/application";
import {get} from "lodash-es";

// http://localhost/zhangze-294c2/applications/panel?app_id=6&release_id=6

interface PanelContextValue {
  git_provider_id?: number;
  git_org_name?: string;
  owner_id?: number;
  repos?: AppRepoRes[];
}

export const PanelContext = createContext<PanelContextValue>({});

const item = {
  "application_env_id": 20,
  "application_id": 22,
  "owner_id": 1,
  "owner_name": "zhangze",
  "name": "main",
  "domain": "chenyuan-first-app-2dq8g7.forkmain.cloud",
  "env_type": "Prod",
  "namespace": "chenyuan-first-app-main",
  "last_release": {
    "id": 22,
    "created_at": 1658828003,
    "created_by": 1,
    "updated_at": 1658828976,
    "updated_by": 1,
    "application_id": 22,
    "application_env_id": 20,
    "name": "chenyuan-first-app-4q9ck",
    "namespace": "",
    "cluster_id": 8,
    "job_namespace": "organization-1",
    "start_time": 1658828003,
    "completion_time": 1658828976,
    "status": "Completed"
  },
  "setting": {
    "is_update": false,
    "application": {
      "name": "chenyuan-first-app",
      "domain": "chenyuan-first-app-2dq8g7.forkmain.cloud",
      "namespace": "chenyuan-first-app-main",
      "deploy": {
        "name": "chenyuan-first-app-deploy",
        "url": "https://github.com/ni9ht-org/chenyuan-first-app-deploy",
        "visibility": "private",
        "path": "chenyuan-first-app",
        "values_file": "values.yaml"
      },
      "service": [{
        "name": "chenyuan-first-app-backend",
        "type": "backend",
        "language": {"name": "golang", "version": "1.18"},
        "framework": "gin",
        "scaffold": true,
        "repo": {"url": "https://github.com/ni9ht-org/chenyuan-first-app-backend", "visibility": "private"},
        "image": {"repository": "ghcr.io/ni9ht-org/chenyuan-first-app-backend", "tag": ""},
        "setting": {
          "extension": {"entry_file": ""},
          "expose": [{"port": 8000, "rewrite": true, "paths": [{"path": "/api"}]}],
          "env": [],
          "fork": {"from": "", "type": ""}
        }
      }, {
        "name": "chenyuan-first-app-frontend",
        "type": "frontend",
        "language": {"name": "typescript", "version": ""},
        "framework": "nextjs",
        "scaffold": true,
        "repo": {"url": "https://github.com/ni9ht-org/chenyuan-first-app-frontend", "visibility": "private"},
        "image": {"repository": "ghcr.io/ni9ht-org/chenyuan-first-app-frontend", "tag": ""},
        "setting": {
          "extension": {"entry_file": ""},
          "expose": [{"port": 80, "rewrite": false, "paths": [{"path": "/"}]}],
          "env": [],
          "fork": {"from": "", "type": ""}
        }
      }]
    },
    "scm": {"name": "github", "type": "github", "organization": "ni9ht-org"},
    "image": {"name": "github", "registry": "ghcr.io", "username": "ni9ht-org", "password": ""},
    "middleware": [],
    "fork_env": {"name": "", "cluster": ""}
  }
}

export default function Newpanel() {
  const [panelContextValue, setPanelContextValue] = useState<PanelContextValue>(
    {}
  );
  const [arrList, setArrList] = useState<number[]>([]);
  let appId = getQuery("app_id");

  const [envlist, setEnvList] = useState<EnvListRes[]>([]);
  const [repoList, setRepoList] = useState<AppRepoRes[]>([]);

  useEffect(() => {
    getProdEnv(appId).then((res) => {
      setPanelContextValue((preState) => {
        return {
          ...preState,
          git_org_name: res.git_org_name,
          git_provider_id: res.git_provider_id,
          owner_id: res.owner_id,
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
  }, []);

  function getEnvList() {
    getEnvs(appId).then(res => {
      setEnvList(res);
      setTimeout(() => {
        getPosition()
      }, 0)
    })
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
    <Layout notStandardLayout pageHeader={`Applications/${get(envlist, '0.setting.application.name', '')}`}>
      <PanelContext.Provider value={panelContextValue}>
        <div className={styles.wrapper}>
          {/*<div className={styles.left}>*/}
          <Canvas arrList={arrList}/>
          <EnvList
            {...{
              spreadCb,
              envlist,
              forkSuccessCb: forkEnvCb
            }}
          />
          {/*</div>*/}
          {/*<div className={styles.right}>*/}
          <RepoList {...{repoList}} />
          {/*</div>*/}
        </div>
      </PanelContext.Provider>
    </Layout>
  );
}

// http://localhost/zhangze-9n6qd/applications/newpanel
