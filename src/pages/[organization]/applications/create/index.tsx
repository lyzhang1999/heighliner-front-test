import SelectAStack from "@/components/Application/Create/SelectAStack";
import FrontEnd from "@/components/Application/Create/FrontEnd";
import BackEnd from "@/components/Application/Create/BackEnd";
import Middlewares from "@/components/Application/Create/Middlewares";
import CreateAppLayout from "@/components/CreateAppLayout";
import Layout from "@/components/Layout";
import React, {useEffect, useRef, useState} from "react";

import Provider from "@/components/Application/Create/Provider";
import {
  FrameWorkInitState,
  BackendType,
  MiddleWaresInitState,
  MiddleWareType,
  SelectAStackType,
  SelectAStackInitState,
  ProvidersType,
  ProvidersInitState, getParams
} from "@/pages/[organization]/applications/create/util";
import {getGitProviderList, getGitProviderOrganizations} from "@/api/gitProviders";
import {cloneDeep} from "lodash-es";
import {createApp, getTheRepoList} from "@/api/application";
import {getUrlEncodeName, Message} from "@/utils/utils";
import {useRouter} from "next/router";


export interface FormStateType {
  selectAStack: SelectAStackType,
  providers: ProvidersType,
  backend: BackendType,
  frontend: BackendType,
  middleWares: MiddleWareType[],
}

export default function Create(): React.ReactElement {
  const router = useRouter();
  const [index, setIndex] = useState<number>(1);
  const [formState, setFormState] = useState<FormStateType>({
    selectAStack: cloneDeep(SelectAStackInitState),
    providers: cloneDeep(ProvidersInitState),
    backend: cloneDeep(FrameWorkInitState),
    frontend: cloneDeep(FrameWorkInitState),
    middleWares: cloneDeep(MiddleWaresInitState)
  });
  const [repoList, setRepoList] = useState([]);

  let nextIndex = 1;

  const gitObj = {
    owner_name: "ni9ht-org",
    git_provider_id: 2,
    owner_type: "Org"
  }

  function getRepoList(body) {
    getTheRepoList(body).then(res => {
      setRepoList(res);
    })
  }

  function goIndex(i) {
    if (i === index) return;
    if (i < 1) return;
    ref?.current?.submit();
    nextIndex = i;
  }

  function create(value) {
    let body = getParams(value, repoList);
    createApp(body).then(res => {
      goDashboard(res)
    })
  }

  function goDashboard(res) {
    let {
      application_id,
      application_release_id
    } = res
    Message.success('Creat Success');
    router.replace(`/${getUrlEncodeName()}/applications/creating?app_id=${application_id}&release_id=${application_release_id}`)
  }

  function submitCb(key: string, value: object) {
    if (key === 'providers') {
      let {git_config} = value;
      let {git_provider_id, owner_name, owner_type} = git_config;
      getRepoList({git_provider_id, owner_name, owner_type});
    }
    setFormState({
      ...formState,
      [key]: cloneDeep(value),
    })
    if (nextIndex === 6) {
      create({
        ...formState,
        [key]: cloneDeep(value),
      })
    } else {
      setIndex(nextIndex);
    }
  }

  const ref = useRef(null);
  const props = {
    ref,
    submitCb,
    formState,
    gitObj,
    repoList
  }

  const mapComponent = [
    <SelectAStack {...props} key="SelectAStack"/>,
    <Provider {...props} key="Provider"/>,
    <BackEnd {...props} key="BackEnd"/>,
    <FrontEnd {...props} key="FrontEnd"/>,
    <Middlewares {...props} key="Middlewares"/>
  ]

  return (
    <Layout notStandardLayout>
      <CreateAppLayout
        {...{
          index,
          goIndex
        }}
      >
        {mapComponent[index - 1]}
      </CreateAppLayout>
    </Layout>
  );
}
