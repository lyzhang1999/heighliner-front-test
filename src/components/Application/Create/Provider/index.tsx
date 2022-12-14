import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
  useContext
} from "react";
import {Controller, FieldValues, useForm} from "react-hook-form";
import GitHubIcon from "@mui/icons-material/GitHub";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import clsx from "clsx";
import Image from "next/image";

import {
  ClusterProvider,
  ClusterStatus,
  createCluster,
  getCluster, getClusterList as getClusterListApi,
} from "@/api/cluster";
import CardSelect, {CardItems} from "@/basicComponents/CardSelect";
import {getClusterIcon} from "@/utils/CDN";
import {CommonProps} from "@/utils/commonType";
import AddFreeClusterSVG from "/public/img/application/create/addFreeCluster.svg";
import {useClusterList} from "@/hooks/cluster";
import useGitProviderOrganizations from "@/hooks/gitProvidersOrganizations";
import NewClusterModal from "@/components/NewClusterModal";
import {AddGitProviderSuccessCb} from "@/components/AddGitProvider";
import {FieldsMap, ProvidersType} from "@/components/Application/Create/util";
import {
  FormStateType,
  LinkMethod,
} from "@/pages/[organization]/applications/creation";
import {FormControl, FormHelperText} from "@mui/material";
import Spinner from "@/basicComponents/Loaders/Spinner";
import {isProduct, Message} from "@/utils/utils";
import {
  GitHubOAuthAppTemporaryStorage,
  openGitHubOAuthWindow,
  PostAuthAction,
} from "@/pages/distributor/post-auth-github";
import {useGlobalLoading} from "@/hooks/GlobalLoading";
import {CreateContext} from "@/pages/[organization]/applications/creation/context";

import styles from "./index.module.scss";
import {getGitProviderOrganizations} from "@/api/gitProviders";

interface Props extends CommonProps {
  submitCb: Function;
  formState: FormStateType;
}

const Provider = forwardRef(function Provider(props: Props, ref) {
  const {submitCb} = props;

  const {state, dispatch} = useContext(CreateContext);
  const {clusterList, gitProviderOrganizations} = state;
  // useEffect(() => {
  //   dispatch({submitFun: handleSubmit(submit)})
  // }, [])

  // const [clusterList, getClusterList] = useClusterList();
  // const [gitProviderOrganizations, updateGitProviderOrganizations] =
  //   useGitProviderOrganizations();

  function getClusterList() {
    getClusterListApi().then(res => {
      // setClusterList(res);
      dispatch({clusterList: res});
    })
  }

  function getProviderList(){
    getGitProviderOrganizations().then((res) => {
      dispatch({gitProviderOrganizations: res})
    });
  }

  // const [clusterCardItems, setClusterCardItems] = useState<CardItems>([]);
  // const [
  //   gitProviderOrganizationsCardItems,
  //   setGitProviderOrganizationsCardItems,
  // ] = useState<CardItems>([]);

  const {providers: providersInitState} = props.formState;

  const DefaultFormValue: FieldValues = {
    [FieldsMap.gitProvider]: providersInitState[FieldsMap.gitProvider],
    [FieldsMap.clusterProvider]: providersInitState[FieldsMap.clusterProvider],
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
  } = useForm({
    defaultValues: DefaultFormValue,
  });

  useImperativeHandle(ref, () => ({
    submit: (flag: LinkMethod) => {
      if (flag === LinkMethod.BACK) {
        backCb();
      } else {
        handleSubmit(submit)();
      }
    },
  }));

  function backCb() {
    submitCb("providers", getValues(), true);
  }

  const submit = async (data: typeof DefaultFormValue) => {
    // Check the cluster status
    const cluster_id = +data[FieldsMap.clusterProvider];
    const cluster = clusterList.find((cluster) => cluster.id === cluster_id);
    if (cluster!.status === ClusterStatus.INITIALIZING) {
      const res = await getCluster({
        cluster_id: cluster_id,
      });
      // If the clsuter is initializing, forbid to create.
      if (res.status === ClusterStatus.INITIALIZING) {
        Message.warning(
          `The clsuter "${res.name}" is still initializing. Please wait 2 to 3 minutes.`
        );
        return;
      }
    }

    // Transform data structure.
    const gitProvider = gitProviderOrganizations.find(
      (gitProvider) =>
        gitProvider.git_owner_name === data[FieldsMap.gitProvider]
    );

    const providersSubmitState: ProvidersType = {
      [FieldsMap.gitProvider]: gitProvider!.git_owner_name,
      [FieldsMap.clusterProvider]: data[FieldsMap.clusterProvider],
      cluster_id: data[FieldsMap.clusterProvider],
      git_config: {
        owner_name: gitProvider!.git_owner_name,
        owner_type: gitProvider!.owner_type,
        git_org_name: gitProvider!.git_owner_name,
        git_provider_id: String(gitProvider!.git_provider_id),
      },
    };

    props.submitCb("providers", providersSubmitState);
  };

  // Update initializing cluster status on time.
  useEffect(() => {
    const hasInitializingCluster = clusterList.some(
      (cluster) => cluster.status === ClusterStatus.INITIALIZING
    );

    let timer: ReturnType<typeof setTimeout>;
    if (hasInitializingCluster) {
      timer = setTimeout(() => {
        getClusterList();
        clearTimeout(timer);
      }, 30000);
    }

    return () => clearTimeout(timer);
  }, [clusterList]);

  return (
    <div className={styles.layout}>
      <Controller
        name={FieldsMap.clusterProvider}
        control={control}
        render={({field}) => (
          <FormControl
            className={styles.wrapper}
            error={errors[FieldsMap.clusterProvider] !== undefined}
          >
            <h1>{FieldsMap.clusterProvider}</h1>
            <ul className={styles.clusterWrap}>
              {clusterList.map((cluster) => (
                <li
                  key={cluster.name}
                  onClick={() => {
                    // Cluster status must is active or initializing
                    [ClusterStatus.ACTIVE, ClusterStatus.INITIALIZING].includes(
                      cluster.status
                    ) && field.onChange(cluster.id);
                  }}
                  className={clsx(
                    cluster.id === +field.value && styles.chosenCluster,
                    ![
                      ClusterStatus.ACTIVE,
                      ClusterStatus.INITIALIZING,
                    ].includes(cluster.status) && styles.inactiveCluster
                  )}
                  title={cluster.status}
                >
                  <div className={styles.clusterIcon}>
                    <Image
                      src={getClusterIcon(cluster.provider as ClusterProvider)}
                      alt=""
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <span title={cluster.name}>{cluster.name}</span>
                  {cluster.status === ClusterStatus.INITIALIZING && (
                    <div className={styles.spinner}>
                      <Spinner spinnerColor="#6b6b6b" scale={"17%"}/>
                    </div>
                  )}
                </li>
              ))}
              <AddCluster
                addClusterSuccessCb={() => {
                  getClusterList();
                }}
              />
              <AddFreeCluster/>
            </ul>
            <FormHelperText>
              {errors[FieldsMap.clusterProvider] &&
                errors[FieldsMap.clusterProvider].message}
            </FormHelperText>
          </FormControl>
        )}
        rules={{
          required: "Please choose a cluster.",
        }}
      />
      <Controller
        name={FieldsMap.gitProvider}
        control={control}
        render={({field}) => (
          <FormControl
            className={styles.wrapper}
            error={errors[FieldsMap.gitProvider] !== undefined}
          >
            <h1>{FieldsMap.gitProvider}</h1>
            <ul className={styles.gitWrap}>
              {gitProviderOrganizations.map((gitProviderOrganization) => (
                <li
                  key={gitProviderOrganization.git_provider_id + gitProviderOrganization.git_owner_name}
                  onClick={() => {
                    field.onChange(gitProviderOrganization.git_owner_name);
                  }}
                  className={clsx(
                    field.value === gitProviderOrganization.git_owner_name &&
                    styles.chosenGit
                  )}
                >
                  <span>
                    <GitHubIcon/>
                  </span>
                  <span title={gitProviderOrganization.git_owner_name}>
                    {gitProviderOrganization.git_owner_name}
                  </span>
                  <span>{gitProviderOrganization.owner_type}</span>
                </li>
              ))}
              <li style={{}}>
                <AddGitProviderItem
                  key="AddGitProvider"
                  addGitProviderSuccessCb={(data) => {
                    getProviderList();
                  }}
                />
              </li>
            </ul>
            {/* <CardSelect
              {...{
                cardItems: gitProviderOrganizationsCardItems,
                control: control,
                name: FieldsMap.clusterProvider,
                customCardItems: [
                  <AddGitProviderItem
                    key="AddGitProvider"
                    addGitProviderSuccessCb={(data) => {
                      getProviderList();
                    }}
                  />,
                ],
                onChange: field.onChange,
                defaultChosenValue: providersInitState[FieldsMap.gitProvider],
              }}
            /> */}
            <FormHelperText>
              {errors[FieldsMap.gitProvider] &&
                errors[FieldsMap.gitProvider].message}
            </FormHelperText>
          </FormControl>
        )}
        rules={{
          required: "Please choose a git provider.",
        }}
      />
    </div>
  );
});

function AddCluster({
                      addClusterSuccessCb,
                    }: {
  addClusterSuccessCb: () => void;
}) {
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
      <AddCircleOutlineIcon/> Add Cluster
      <NewClusterModal
        setModalDisplay={setOpenAddClusterDrawer}
        successCb={addClusterSuccessCb}
        modalDisplay={openAddClusterDrawer}
      />
    </li>
  );
}

function AddFreeCluster({successCb}: { successCb?: () => void }) {
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
      <AddFreeClusterSVG/>
      Get Free Cluster
    </li>
  );
}

function AddGitProviderItem({
                              addGitProviderSuccessCb,
                            }: {
  addGitProviderSuccessCb?: AddGitProviderSuccessCb;
}) {
  const {setGlobalLoading} = useGlobalLoading();

  const clickHandler = () => {
    window.localStorage.setItem(
      GitHubOAuthAppTemporaryStorage.postAuthAction,
      PostAuthAction.AddGitProvider
    );

    let domain: string = isProduct()
      ? process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_REPO_URL_PROD!
      : process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_REPO_URL!;

    openGitHubOAuthWindow(
      new URL(domain),
      setGlobalLoading,
      function successCb() {
        // Get the createGitProvideRes and execute the successCb.
        const rowCreateGitProvideRes = window.localStorage.getItem(
          GitHubOAuthAppTemporaryStorage.createGitProviderRes
        );
        window.localStorage.removeItem(
          GitHubOAuthAppTemporaryStorage.createGitProviderRes
        );
        const createGitProvideRes = rowCreateGitProvideRes
          ? JSON.parse(rowCreateGitProvideRes)
          : {};
        addGitProviderSuccessCb && addGitProviderSuccessCb(createGitProvideRes);
      }
    );
  };

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
        borderRadius: 3,
      }}
      onClick={clickHandler}
    >
      Add GitHub Account
    </div>
  );
}

export default Provider;
