/**
 * New Application Create page.
 */

import {useForm} from "react-hook-form";

import SelectAStack from "@/components/Application/Create/SelectAStack";
import FrontEnd from "@/components/Application/Create/FrontEnd";
import BackEnd from "@/components/Application/Create/BackEnd";
import Middlewares from "@/components/Application/Create/Middlewares";
import CreateAppLayout from "@/components/CreateAppLayout";
import Layout from "@/components/Layout";
import React, {useEffect, useRef, useState} from "react";

import styles from "./index.module.scss";
import Provider from "@/components/Application/Create/Provider";
import {
  FrameWorkInitState,
  BackendType,
  MiddleWaresInitState,
  MiddleWareType
} from "@/pages/[organization]/applications/create/util";
import {getGitProviderList, getGitProviderOrganizations} from "@/api/gitProviders";
import {cloneDeep} from "lodash-es";
import {getTheRepoList} from "@/api/application";

export const FieldsMap = {
  stack: "Stack",
  name: "Name",
  gitProvider: "Git Provider",
  clusterProvider: "Cluster Provider",
};

const DefaultFieldsValue = {
  [FieldsMap.gitProvider]: "",
};

type FieldsType = typeof DefaultFieldsValue;

export interface FormStateType {
  backend: BackendType,
  frontend: BackendType,
  middleWares: MiddleWareType[],
}

export default function Create(): React.ReactElement {
  const [index, setIndex] = useState<number>(5);
  const [formState, setFormState] = useState<FormStateType>({
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

  useEffect(() => {
    // getGitProviderOrganizations().then(res => {
    //   // console.warn(res)
    // })
    getTheRepoList(gitObj).then(res => {
      setRepoList(res);
      // console.warn(res)
    })
  }, [])

  function goIndex(i) {
    if (i === index) return;
    if (i < 1) return;
    if (i <= 6) {
      nextIndex = i;
      ref?.current?.submit();
    } else {
      setTimeout(() => {
        console.warn(formState)
      }, 1000)
    }
  }

  function submitCb(key: string, value: object) {
    console.warn(value)
    setFormState({
      ...formState,
      [key]: cloneDeep(value),
    })
    setIndex(nextIndex);
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
    <SelectAStack {...props}/>,
    <Provider {...props}/>,
    <BackEnd {...props}/>,
    <FrontEnd {...props}/>,
    <Middlewares {...props}/>
  ]

  const {
    handleSubmit,
    control,
    formState: {errors},
    setValue,
  } = useForm<FieldsType>({
    defaultValues: DefaultFieldsValue,
  });


  return (
    <Layout notStandardLayout>
      <CreateAppLayout
        {...{
          index,
          goIndex
        }}
      >
        {mapComponent[index - 1]}
        {/*<SelectAStack*/}
        {/*  {...{*/}
        {/*    name: FieldsMap.name,*/}
        {/*    control,*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<Provider {*/}
        {/*  ...{*/}
        {/*    control*/}
        {/*  }*/}
        {/*} />*/}
      </CreateAppLayout>
    </Layout>
  );
}
