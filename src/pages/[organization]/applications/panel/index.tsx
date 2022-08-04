import React, {createContext, useEffect, useState} from "react";
import {get, isEmpty} from "lodash-es";

import styles from "./index.module.scss";
import Layout from "@/components/Layout";
import RepoList from "@/components/Panel/RepoList";
import Canvas from "@/pages/[organization]/applications/panel/canvas";
import EnvList, {itemClass} from "@/components/Panel/EnvList";
import {getQuery} from "@/utils/utils";
import {
  AppRepoRes,
  EnvItemRes,
  getApplicationRepos,
  getEnvs,
  getProdEnv,
} from "@/api/application";

interface PanelContextValue {
  git_provider_id?: number;
  git_org_name?: string;
  owner_id?: number;
  repos?: AppRepoRes[];
  prodEnvId?: number;
}

export const PanelContext = createContext<PanelContextValue>({});

export default function Newpanel() {
  const [panelContextValue, setPanelContextValue] = useState<PanelContextValue>(
    {}
  );
  const [arrList, setArrList] = useState<number[]>([]);
  let appId = getQuery("app_id");

  const [envlist, setEnvList] = useState<EnvItemRes[]>([]);
  const [repoList, setRepoList] = useState<AppRepoRes[]>([]);
  const [git_provider_id, setGit_provider_id] = useState<string>('');

  useEffect(() => {
    getProdEnv(appId).then((res) => {
      setGit_provider_id(String(res.git_provider_id));
      setPanelContextValue((preState) => {
        return {
          ...preState,
          git_org_name: res.git_org_name,
          git_provider_id: res.git_provider_id,
          owner_id: res.owner_id,
          prodEnvId: res.id
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
    <Layout notStandardLayout pageHeader={`Applications / ${get(envlist, '0.setting.application.name', '')}`}>
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
          {
            git_provider_id && !isEmpty((repoList)) && (
               <div 
                style={{   
                  marginLeft: '20px',
                  marginTop: '50px',
                  marginRight: '50px',
                  width: '30%',
                  maxWidth: '500px',
                  // display: 'flex'
                }}>
                <RepoList {...{repoList, git_provider_id: +git_provider_id}} />
              </div>
            )
          }
          {/*</div>*/}
        </div>
      </PanelContext.Provider>
    </Layout>
  );
}

// http://localhost/zhangze-9n6qd/applications/newpanel
