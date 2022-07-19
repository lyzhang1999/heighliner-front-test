/**
 * New Application Create page.
 */

import GitProvider from "@/components/Application/Create/GitProviderField";
import SelectAStack from "@/components/Application/Create/SelectAStack";
import FrontEnd from "@/components/Application/Create/FrontEnd";
import BackEnd from "@/components/Application/Create/BackEnd";
import Middlewares from "@/components/Application/Create/Middlewares";
import Layout from "@/components/Layout";
import React, {useRef, useState} from "react";
import {useForm} from "react-hook-form";

import styles from "./index.module.scss";
import CreateAppLayout from "@/components/CreateAppLayout";

export const FieldsMap = {
  stack: "stack",
  name: "name",
  gitProvider: "gitProvider",
};

const DefaultFieldsValue = {
  [FieldsMap.gitProvider]: "",
};

type FieldsType = typeof DefaultFieldsValue;


export default function Create(): React.ReactElement {
  // const {
  //   handleSubmit,
  //   control,
  //   formState: {errors},
  //   setValue,
  // } = useForm<FieldsType>({
  //   defaultValues: DefaultFieldsValue,
  // });

  const [index, setIndex] = useState<number>(4);
  const [nextIndex, setNextIndex] = useState<number>(0);

  function setCurrentIndex(value: number) {
    setIndex(index)
  }

  function nextCb() {
    console.warn('next')
    setNextIndex(index + 1)
    console.warn(ref.current.submit())
  }

  function backCb() {
    setNextIndex(index - 1)
    console.warn('back')
    console.warn(ref.current.submit())
  }

  function submitCb() {
    setInterval(() => {
      console.warn(nextIndex)
    }, 1000)
  }

  const ref = useRef(null);
  const props = {
    ref,
    setIndex,
    index,
    nextIndex,
    submitCb
  }

  const mapComponent = {
    1: <SelectAStack {...props}/>,
    2: <GitProvider {...props}/>,
    3: <BackEnd {...props}/>,
    4: <FrontEnd {...props}/>,
    5: <Middlewares {...props}/>,
  }


  return (
    <Layout notStandardLayout>
      {nextIndex} {index}
      <CreateAppLayout
        {...{
          backCb,
          nextCb,
          index
        }}
      >
        {mapComponent[index]}
        {/*<FrontEnd></FrontEnd>*/}
      </CreateAppLayout>
      {/*<div className={styles.panel}>*/}
      {/*<GitProvider*/}
      {/*  {...{*/}
      {/*    name: FieldsMap.gitProvider,*/}
      {/*    control,*/}
      {/*    error: errors[FieldsMap.gitProvider],*/}
      {/*    className: styles.gitProviderWrapper,*/}
      {/*  }}*/}
      {/*/>*/}
      {/*</div>*/}
    </Layout>
  );
}
