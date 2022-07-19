/**
 * New Application Create page.
 */

import GitProvider from "@/components/Application/Create/GitProviderField";
import Layout from "@/components/Layout";
import React from "react";
import { useForm } from "react-hook-form";

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
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FieldsType>({
    defaultValues: DefaultFieldsValue,
  });

  return (
    <Layout notStandardLayout>
      <CreateAppLayout/>
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
