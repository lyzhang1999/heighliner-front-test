/**
 * New Application Create page.
 */

import React from "react";
import { useForm } from "react-hook-form";

import GitProvider from "@/components/Application/Create/GitProviderField";
import SelectAStack from "@/components/Application/Create/SelectAStack";
import CreateAppLayout from "@/components/CreateAppLayout";
import Layout from "@/components/Layout";

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
      <CreateAppLayout>
        <SelectAStack
          {...{
            name: FieldsMap.name,
            control,
          }}
        />
        <Provider {
          ...{
            control
          }
        } />
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
