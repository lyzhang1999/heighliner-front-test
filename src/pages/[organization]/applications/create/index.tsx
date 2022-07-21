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
import {BackendInitState, BackendtType, SelectAStackInitState, SelectAStackType} from "@/pages/[organization]/applications/create/util";
import {getGitProviderList, getGitProviderOrganizations} from "@/api/gitProviders";
import {cloneDeep} from "lodash-es";


export interface FormStateType {
  backend: BackendtType,
  frontend: BackendtType,
  selectAStack: SelectAStackType,
}

export default function Create(): React.ReactElement {
  const [index, setIndex] = useState<number>(1);
  const [formState, setFormState] = useState<FormStateType>({
    backend: BackendInitState,
    frontend: BackendInitState,
    selectAStack: SelectAStackInitState,
  });
  let nextIndex = 1;

  const gitObj = {
    owner_name: "ni9ht-org",
    git_provider_id: 2,
    owner_type: "Org"
  }

  useEffect(() => {
    getGitProviderOrganizations().then(res => {
      // console.warn(res)
    })
  }, [])

  function goIndex(i) {
    if (i === index) return;
    if ((i > 5) || (i < 1)) return;
    nextIndex = i;
    ref?.current?.submit();
  }

  function submitCb(key: string, value: object) {
    setFormState({
      ...formState,
      [key]: cloneDeep(value),
    })
    // setIndex(nextIndex);
  }

  const ref = useRef(null);
  const props = {
    ref,
    submitCb,
    formState,
    gitObj
  }

  const mapComponent = [
    <SelectAStack {...props}/>,
    <Provider {...props}/>,
    <BackEnd {...props}/>,
    <FrontEnd {...props}/>,
    <Middlewares {...props}/>
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
