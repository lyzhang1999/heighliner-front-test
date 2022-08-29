import SelectAStack from "@/components/Application/Create/SelectAStack";
import FrontEnd from "@/components/Application/Create/FrontEnd";
import BackEnd from "@/components/Application/Create/BackEnd";
import Middlewares from "@/components/Application/Create/Middlewares";

import CreateAppLayout from "@/components/CreateAppLayout";
import Layout from "@/components/Layout";
import React, { useReducer, useRef, useEffect } from "react";
import Provider from "@/components/Application/Create/Provider";
import {
  getParams,
  getMicroParams,
} from "@/components/Application/Create/util";
import { cloneDeep, get } from "lodash-es";
import { createApp, createAppRes, getRepoListReq, getRepoListRes, getTheRepoList } from "@/api/application";
import { getUrlEncodeName, Message } from "@/utils/utils";
import { useRouter } from "next/router";
import { CreateContext, FormStateType, State } from "@/pages/[organization]/applications/creation/context";
import { initState, reducer } from "./context";
import MicroService from "@/components/Application/Create/MicroService";
import NetworkConfig from "@/components/Application/Create/NetworkConfig";
import { getClusterList } from "@/api/cluster";
import { getGitProviderOrganizations } from "@/api/gitProviders";

export enum LinkMethod {
  BACK = 'back',
  NEXT = 'next',
}

export default function Create(): React.ReactElement {
  const router = useRouter();
  const [state, dispatch] = useReducer(reducer, initState);
  const { repoList, index, formState } = state;
  let stack: string = get(formState, "selectAStack.Stack", '');

  let nextIndex = 1;

  const gitObj = {
    owner_name: "ni9ht-org",
    git_provider_id: 2,
    owner_type: "Org"
  }

  function getRepoList(body: getRepoListReq) {
    getTheRepoList(body).then(res => {
      dispatch({ repoList: res });
    })
  }

  useEffect(() => {
    getClusterList().then(res => {
      dispatch({ clusterList: res });
    })
    getGitProviderOrganizations().then((res) => {
      dispatch({ gitProviderOrganizations: res })
    });
  }, [])

  function goIndex(i: number) {
    if (i === index) return;
    if (i < 1) return;
    if (i < (index as number)) {
      get(ref, 'current.submit', () => null)(LinkMethod.BACK);
    } else {
      get(ref, 'current.submit', () => null)(LinkMethod.NEXT);
    }
    nextIndex = i;
  }

  function create(value: FormStateType) {
    let body = null;
    if (stack === 'web') {
      body = getParams(value, repoList as getRepoListRes[]);
    } else if (stack === 'micro') {
      body = getMicroParams(value, repoList as getRepoListRes[]);
    }
    createApp(body).then(res => {
      goDashboard(res)
    })
  }

  function goDashboard(res: createAppRes) {
    let {
      application_id,
      application_release_id
    } = res
    Message.info('Application creating');
    router.replace(`/${getUrlEncodeName()}/applications/panel?app_id=${application_id}&release_id=${application_release_id}`)
    // router.replace(`/${getUrlEncodeName()}/applications/creating?app_id=${application_id}&release_id=${application_release_id}`)
  }

  function submitCb(key: string, value: object, isBack?: boolean) {
    console.warn(value)
    if ((key === 'providers') && !isBack) {
      let { git_provider_id, owner_name, owner_type } = get(value, 'git_config', {});
      getRepoList({ git_provider_id, owner_name, owner_type });
    }
    dispatch({
      formState: {
        ...formState,
        [key]: cloneDeep(value),
      }
    });
    if (nextIndex === 6) {
      create({
        ...formState,
        [key]: cloneDeep(value),
      })
    } else {
      setTimeout(() => {
        dispatch({ index: nextIndex })
      }, 100)
    }
  }

  const ref = useRef(null);

  const props = {
    ref,
    submitCb,
    formState,
    gitObj,
    repoList,
    stack
  }

  let mapComponent = [];
  if (stack === 'web') {
    mapComponent = [
      <SelectAStack {...props} key="SelectAStack" />,
      <Provider {...props} key="Provider" />,
      <BackEnd {...props} key="BackEnd" />,
      <FrontEnd {...props} key="FrontEnd" />,
      <Middlewares {...props} key="Middlewares" />
    ]
  } else if (stack === 'micro') {
    mapComponent = [
      <SelectAStack {...props} key="SelectAStack" />,
      <Provider {...props} key="Provider" />,
      <MicroService {...props} key="MicroService" />,
      <NetworkConfig {...props} key="NetworkConfig" />,
      <Middlewares {...props} key="Middlewares" />
    ]
  } else {
    mapComponent = [
      // <MicroService {...props} key="MicroService"/>,
      <SelectAStack {...props} key="SelectAStack" />,
    ]
  }

  return (
    <Layout notStandardLayout>
      <CreateContext.Provider value={{ state, dispatch }}>
        <CreateAppLayout
          {...{
            index,
            goIndex,
            stack
          }}
        >
          {mapComponent[index - 1]}
        </CreateAppLayout>
      </CreateContext.Provider>
    </Layout>
  );
}
