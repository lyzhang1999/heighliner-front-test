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


export default function Create(): React.ReactElement {
  const [index, setIndex] = useState<number>(4);
  let nextIndex = 0;


  function nextCb() {
    nextIndex = index + 1;
    console.warn(ref.current.submit())
  }

  function backCb() {
    nextIndex = index - 1;
    console.warn(ref.current.submit())
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
    2: <GitProvider {...props}/>,
    3: <BackEnd {...props}/>,
    4: <FrontEnd {...props}/>,
    5: <Middlewares {...props}/>,
  }


  return (
    <Layout notStandardLayout>
      <CreateAppLayout
        {...{
          backCb,
          nextCb,
          index
        }}
      >
        {mapComponent[index]}
      </CreateAppLayout>
    </Layout>
  );
}
