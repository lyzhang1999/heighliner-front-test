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
import React, {useRef, useState} from "react";

import styles from "./index.module.scss";
import Provider from "@/components/Application/Create/Provider";

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

export default function Create(): React.ReactElement {
  const [index, setIndex] = useState<number>(4);
  let nextIndex = 1;

  function goIndex(i) {
    if (i === index) return;
    if ((i > 5) || (i < 1)) return;
    nextIndex = i;
    ref?.current?.submit();
  }

  function submitCb() {
    setIndex(nextIndex);
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
    2: <Provider {...props}/>,
    3: <BackEnd {...props}/>,
    4: <FrontEnd {...props}/>,
    5: <Middlewares {...props}/>,
  }

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
        {mapComponent[index]}
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
