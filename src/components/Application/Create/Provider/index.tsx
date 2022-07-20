import CardSelect, { CardItems } from "@/basicComponents/CardSelect";
import { FieldsMap } from "@/pages/[organization]/applications/create";
import { CommonProps } from "@/utils/commonType";
import React from "react";
import { Control, Controller } from "react-hook-form";

import styles from "./index.module.scss";

interface Props extends CommonProps {
  control: Control;
}

const clusterCardItems: CardItems = [
  {
    icon: "",
    name: "AWS-Cluster1",
  },
  {
    icon: "",
    name: "AWS-Cluster2",
  },
  {
    icon: "",
    name: "Office-RKE",
  },
  {
    icon: "",
    name: "Free-Cluster",
  },
];

const gitCardItems: CardItems = [
  {
    icon: "",
    name: "Organization1",
  },
  {
    icon: "",
    name: "Organization2",
  },
  {
    icon: "",
    name: "Organization3",
  },
  {
    icon: "",
    name: "Organization4",
  },
];

export default function Provider(props: Props): React.ReactElement {
  return (
    <>
      <Controller
        name={FieldsMap.clusterProvider}
        control={props.control}
        render={({ field }) => (
          <div className={styles.wrapper}>
            <h1>{FieldsMap.clusterProvider}</h1>
            <CardSelect
              {...{
                cardItems: clusterCardItems,
                control: props.control,
                name: FieldsMap.clusterProvider,
              }}
            />
          </div>
        )}
      />
      <Controller
        name={FieldsMap.gitProvider}
        control={props.control}
        render={({ field }) => (
          <div className={styles.wrapper}>
            <h1>{FieldsMap.gitProvider}</h1>
            <CardSelect
              {...{
                cardItems: gitCardItems,
                control: props.control,
                name: FieldsMap.clusterProvider,
              }}
            />
          </div>
        )}
      />
    </>
  );
}
