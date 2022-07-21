import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Control, Controller, useForm } from "react-hook-form";
import GitHubIcon from "@mui/icons-material/GitHub";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import clsx from "clsx";

import { ClusterProvider, createCluster } from "@/api/cluster";
import CardSelect, { CardItems } from "@/basicComponents/CardSelect";
import { FieldsMap } from "@/pages/[organization]/applications/create";
import { getClusterIcon } from "@/utils/CDN";
import { CommonProps } from "@/utils/commonType";
import AddFreeClusterSVG from "/public/img/application/create/addFreeCluster.svg";

import styles from "./index.module.scss";
import { useClusterList } from "@/hooks/cluster";
import useGitProviderOrganizations from "@/hooks/gitProvidersOrganizations";
import NewClusterModal from "@/components/NewClusterModal";
import Image from "next/image";
import AddGitProvider from "@/components/AddGitProvider";

interface Props extends CommonProps {
  submitCb: Function;
}

const Provider = forwardRef(function Provider(props: Props, ref) {
  const [clusterList, getClusterList] = useClusterList();
  const [gitProviderOrganizations, updateGitProviderOrganizations] =
    useGitProviderOrganizations();

  const [clusterCardItems, setClusterCardItems] = useState<CardItems>([]);
  const [
    gitProviderOrganizationsCardItems,
    setGitProviderOrganizationsCardItems,
  ] = useState<CardItems>([]);

  const FormDefaultValues = {
    [FieldsMap.clusterProvider]: "",
    [FieldsMap.gitProvider]: "",
  };
  const { control, handleSubmit } = useForm({
    defaultValues: FormDefaultValues,
  });

  const submit = (data: typeof FormDefaultValues) => {
    props.submitCb();
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(submit)();
    },
  }));

  useEffect(() => {
    const cardItems: CardItems = [];
    clusterList.map((cluster) => {
      cardItems.push({
        icon: getClusterIcon(cluster.provider),
        name: cluster.name,
        iconSettings: {
          leftLayout: true,
          width: 29,
          height: 29,
        },
      });
    });
    setClusterCardItems(cardItems);
  }, [clusterList]);

  useEffect(() => {
    const cardItems: CardItems = [];
    gitProviderOrganizations.map((gitProviderOrganization) => {
      cardItems.push({
        name: gitProviderOrganization.git_owner_name,
        icon: <GitHubIcon />,
        iconSettings: {
          leftLayout: true,
        },
      });
    });
    setGitProviderOrganizationsCardItems(cardItems);
  }, [gitProviderOrganizations]);

  return (
    <>
      <Controller
        name={FieldsMap.clusterProvider}
        control={control}
        render={({ field }) => (
          <div className={styles.wrapper}>
            <h1>{FieldsMap.clusterProvider}</h1>
            {/* <CardSelect
              {...{
                cardItems: clusterCardItems,
                control,
                name: FieldsMap.clusterProvider,
                customCardItems: [<AddCluster key="Add Cluster" />],
              }}
            /> */}
            <ul className={styles.clusterWrap}>
              {clusterList.map((cluster) => (
                <li
                  key={cluster.id}
                  onClick={() => {
                    field.onChange(cluster.id);
                  }}
                  className={clsx(cluster.id === +field.value && styles.chosen)}
                >
                  <div
                    style={{
                      position: "relative",
                      width: 29,
                      height: 29,
                      marginLeft: 9,
                    }}
                  >
                    <Image
                      src={getClusterIcon(cluster.provider)}
                      alt=""
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  {cluster.name}
                </li>
              ))}
              <AddCluster />
              <AddFreeCluster />
            </ul>
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
                cardItems: gitProviderOrganizationsCardItems,
                control: control,
                name: FieldsMap.clusterProvider,
                customCardItems: [<AddGitProviderItem key="AddGitProvider" />],
              }}
            />
          </div>
        )}
      />
    </>
  );
});

function AddCluster() {
  const [openAddClusterDrawer, setOpenAddClusterDrawer] = useState(false);

  return (
    <li
      style={{
        backgroundImage: "linear-gradient(105deg, #2e77ce 4%, #3e95de 99%)",
        color: "#f1f6ff",
        display: "flex",
        flexDirection: "row",
        fontFamily: "Jost",
        fontSize: 13,
        alignItems: "center",
        justifyContent: "center",
        gap: 16.8,
        borderRadius: 7,
      }}
      onClick={() => {
        setOpenAddClusterDrawer(true);
      }}
      key={"AddCluster"}
    >
      <AddCircleOutlineIcon /> Add Cluster
      <NewClusterModal
        setModalDisplay={setOpenAddClusterDrawer}
        // successCb={addClusterSuccessCb}
        modalDisplay={openAddClusterDrawer}
      />
    </li>
  );
}

function AddFreeCluster({ successCb }: { successCb?: () => void }) {
  const clickHandler = () => {
    createCluster({
      kubeconfig: "",
      name: "",
      provider: "freeCluster",
    }).then(() => {
      successCb && successCb();
    });
  };

  return (
    <li
      style={{
        backgroundImage: "linear-gradient(108deg, #215ec0 2%, #3f98e0 100%)",
        borderRadius: 5,
        border: "solid 2px #3585d6",
        color: "#ecf3ff",
        justifyContent: "center",
      }}
      onClick={clickHandler}
    >
      <AddFreeClusterSVG />
      Get Free Cluster
    </li>
  );
}

function AddGitProviderItem() {
  const [openAddGitProviderDrawer, setOpenAddGitProviderDrawer] =
    useState(false);

  return (
    <div
      style={{
        backgroundImage: "linear-gradient(105deg, #2e77ce 4%, #3e95de 99%)",
        color: "#f1f6ff",
        fontFamily: "Jost",
        fontSize: 13,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        width: "100%",
        borderRadius: 3
      }}
      onClick={() => {
        setOpenAddGitProviderDrawer(true);
      }}
    >
      Add GitHub Account
      <AddGitProvider
        setModalDisplay={setOpenAddGitProviderDrawer}
        modalDisplay={openAddGitProviderDrawer}
        // successCb={addGitProviderSuccessCb}
      />
    </div>
  );
}

export default Provider;
