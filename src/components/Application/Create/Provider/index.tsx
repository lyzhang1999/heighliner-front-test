import React from "react";
import { Control, Controller, useForm } from "react-hook-form";
import GitHubIcon from "@mui/icons-material/GitHub";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

import { ClusterProvider } from "@/api/cluster";
import CardSelect, { CardItems } from "@/basicComponents/CardSelect";
import { FieldsMap } from "@/pages/[organization]/applications/create";
import { getClusterIcon } from "@/utils/CDN";
import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";

interface Props extends CommonProps {}

const clusterCardItems: CardItems = [
  {
    icon: getClusterIcon(ClusterProvider.AWS),
    iconSettings: {
      leftLayout: true,
      width: 29,
      height: 29,
    },
    name: "AWS-Cluster1",
  },
  {
    icon: getClusterIcon(ClusterProvider.Kubeconfig),
    iconSettings: {
      leftLayout: true,
      width: 29,
      height: 29,
    },
    name: "AWS-Cluster2",
  },
  {
    icon: getClusterIcon(ClusterProvider.Free),
    iconSettings: {
      leftLayout: true,
      width: 29,
      height: 29,
    },
    name: "Office-RKE",
  },
  {
    icon: getClusterIcon(ClusterProvider.AWS),
    iconSettings: {
      leftLayout: true,
      width: 29,
      height: 29,
    },
    name: "Free-Cluster",
  },
];

const gitCardItems: CardItems = [
  {
    icon: <GitHubIcon />,
    iconSettings: {
      leftLayout: true,
    },
    name: "Organization1",
  },
  {
    icon: <GitHubIcon />,
    iconSettings: {
      leftLayout: true,
    },
    name: "Organization2",
  },
  {
    icon: <GitHubIcon />,
    iconSettings: {
      leftLayout: true,
    },
    name: "Organization3",
  },
  {
    icon: <GitHubIcon />,
    iconSettings: {
      leftLayout: true,
    },
    name: "Organization4",
  },
  {
    icon: <AddCircleOutlineIcon />,
    iconSettings: {
      leftLayout: true,
    },
    name: "Add Cluster",
    customClick: (e) => {

    }
  },
];

export default function Provider(props: Props): React.ReactElement {
  const { control } = useForm({
    defaultValues: {
      [FieldsMap.clusterProvider]: "",
      [FieldsMap.gitProvider]: "",
    },
  });

  return (
    <>
      <Controller
        name={FieldsMap.clusterProvider}
        control={control}
        render={({ field }) => (
          <div className={styles.wrapper}>
            <h1>{FieldsMap.clusterProvider}</h1>
            <CardSelect
              {...{
                cardItems: clusterCardItems,
                control: control,
                name: FieldsMap.clusterProvider,
              }}
            />
          </div>
        )}
      />
      <Controller
        name={FieldsMap.gitProvider}
        control={control}
        render={({ field }) => (
          <div className={styles.wrapper}>
            <h1>{FieldsMap.gitProvider}</h1>
            <CardSelect
              {...{
                cardItems: gitCardItems,
                control: control,
                name: FieldsMap.clusterProvider,
              }}
            />
          </div>
        )}
      />
    </>
  );
}
