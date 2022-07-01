import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import clsx from "clsx";

import Layout from "@/components/Layout";
import {
  ClusterItem,
  ClusterProvider,
  ClusterStatus,
  getCluster,
} from "@/utils/api/cluster";

import styles from "./index.module.scss";
import NewClusterModal from "@/components/NewClusterModal";
import {
  createApplication,
  CreateApplicationRequest,
} from "@/utils/api/application";
import { useRouter } from "next/router";
import { get } from "lodash-es";
import { formatDate, getOrganizationNameByUrl, Message } from "@/utils/utils";
import {
  getClusterIcon,
  GinIcon,
  NextIcon,
  PlusIcon,
  RemixIcon,
  SpringIcon,
  VueIcon,
} from "@/utils/CDN";
import Spinner from "@/basicComponents/Loaders/Spinner";
import GitHubSVG from "/public/img/gitprovider/GITHUB.svg";
import AddGitProvider, {
  AddGitProviderSuccessCb,
} from "@/components/AddGitProvider";
import { useClusterList } from "@/hooks/cluster";
import useGitProviders from "@/hooks/gitProviders";
import useStacks from "@/hooks/stacks";
import { GitProvider } from "@/utils/api/gitProviders";

type FieldsDataType = typeof DefaultFieldsData;

const fieldsMap = {
  applicationName: "name",
  stack: "stack",
  cluster: "cluster",
  gitProvider: "git provider",
  domain: "domain",
};

const DefaultFieldsData = {
  [fieldsMap.applicationName]: "",
  [fieldsMap.stack]: "",
  [fieldsMap.cluster]: "",
  [fieldsMap.gitProvider]: "",
  // [fieldsMap.domain.name]: "",
};

const stacksMap: { [index: string]: string[] } = {
  ["gin-next"]: [GinIcon, NextIcon],
  ["spring-vue"]: [SpringIcon, VueIcon],
  ["gin-vue"]: [GinIcon, VueIcon],
  ["remix"]: [RemixIcon],
  ["gin"]: [GinIcon],
  ["dotnet-react-dapr"]: [GinIcon],
  ["sample"]: [GinIcon],
};

export default function Index(): React.ReactElement {
  const [openAddClusterDrawer, setOpenAddClusterDrawer] = useState(false);
  const [openAddGitProviderDrawer, setOpenAddGitProviderDrawer] =
    useState(false);

  const [stackList, getStackList] = useStacks();
  const [clusterList, getClusterList] = useClusterList();
  const [gitProviderList, getGitProviderList] = useGitProviders();

  const router = useRouter();

  // Used by calculate in Slide blue Background
  const eleList = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    // useRef<HTMLDivElement | null>(null),
  ];

  const [underBgStyle, setUnderBgStyle] = useState({
    top: 0,
    height: 0,
  });

  const calculateUnderBgStyle = (index: number) => {
    setUnderBgStyle({
      top: eleList[index].current?.offsetTop! - 17,
      height: eleList[index].current?.clientHeight! + 34,
    });
  };

  // Get the form in need
  const {
    handleSubmit,
    control,
    formState: { errors },
    setValue,
  } = useForm<FieldsDataType>({
    defaultValues: DefaultFieldsData,
  });

  useEffect(() => {
    calculateUnderBgStyle(0);
  }, []);
  useEffect(() => {
    calculateUnderBgStyle(2);
  }, [clusterList]);
  useEffect(() => {
    calculateUnderBgStyle(3);
  }, [gitProviderList]);

  // When open add cluster or git provider drawer, updating data.
  useEffect(() => {
    getClusterList();
  }, [openAddClusterDrawer]);
  useEffect(() => {
    getGitProviderList();
  }, [openAddGitProviderDrawer]);

  // Choose only one cluster/gitProvider
  useEffect(() => {
    if (
      clusterList.length === 1 &&
      clusterList[0].status === ClusterStatus.Active
    ) {
      setValue(fieldsMap.cluster, clusterList[0].id.toString());
    }
  }, [clusterList]);
  useEffect(() => {
    if (gitProviderList.length === 1) {
      setValue(fieldsMap.gitProvider, gitProviderList[0].id.toString());
    }
  }, [gitProviderList]);

  const addGitProviderSuccessCb: AddGitProviderSuccessCb = (
    gitProviderItem
  ) => {
    setValue(fieldsMap.gitProvider, gitProviderItem.id.toString());
  };

  // Polling status for initializing cluster.
  useEffect(() => {
    const hasInitializingCluster = clusterList.some(
      (cluster) => cluster.status === ClusterStatus.Initializing
    );

    let timer: ReturnType<typeof setTimeout>;
    if (hasInitializingCluster) {
        timer = setTimeout(()=> {
          getClusterList();
          clearTimeout(timer);
        }, 30000);
    }

    return () => clearTimeout(timer);
  }, [clusterList]);

  const onSubmit: SubmitHandler<FieldsDataType> = async (data) => {
    // Check the cluster status
    const cluster_id = +data[fieldsMap.cluster];
    const cluster = clusterList.find((cluster) => cluster.id === cluster_id);
    if (cluster!.status === ClusterStatus.Initializing) {
      const res = await getCluster({
        cluster_id: cluster_id,
      });
      // If the clsuter is initializing, forbid to create.
      if (res.status === ClusterStatus.Initializing) {
        Message.warning(
          `The clsuter "${res.name}" is still initializing. Please wait for a moment.`
        );
        return;
      }
    }

    const createApplicationRequest: CreateApplicationRequest = {
      cluster_id: +data[fieldsMap.cluster],
      git_config: {
        git_provider_id: +data[fieldsMap.gitProvider],
      },
      name: data[fieldsMap.applicationName],
      networking: {
        domain: "",
      },
      stack_id: +data[fieldsMap.stack],
    };

    createApplication(createApplicationRequest).then((res) => {
      router.push(
        `/${encodeURIComponent(
          getOrganizationNameByUrl()
        )}/applications/creating?app_id=${res.app_id}&release_id=${
          res.release_id
        }`
      );
    });
  };

  return (
    <Layout notStandardLayout>
      <form onSubmit={handleSubmit(onSubmit)} className={styles.panel}>
        <Typography variant="h1">New Application</Typography>
        <div className={styles.underBackground} style={underBgStyle}></div>
        <Controller
          name={fieldsMap.applicationName}
          control={control}
          render={({ field }) => (
            <FormControl
              ref={eleList[0]}
              error={errors[fieldsMap.applicationName] ? true : false}
              className={styles.applicationNameWrap}
            >
              <h2 className={styles.applicationName}>
                {fieldsMap.applicationName}
                <span className={styles.star}>*</span>
              </h2>
              <div>
                <TextField
                  onChange={field.onChange}
                  value={field.value}
                  className={clsx(styles.applicationNameInput)}
                  onFocus={() => {
                    calculateUnderBgStyle(0);
                  }}
                  placeholder="Please enter the application name."
                  autoFocus
                ></TextField>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.applicationName] &&
                    errors[fieldsMap.applicationName].message}
                </FormHelperText>
              </div>
            </FormControl>
          )}
          rules={{
            /** Follow with RFC 1035 */
            required: "Please enter your application name.",
            validate: {
              illegalCharacter: (value) => {
                return (
                  !/[^a-z0-9-]/.test(value) ||
                  "The name only contain lowercase alphanumeric character, or hyphen(-)."
                );
              },
              illegalStart: (value) => {
                return (
                  /^[a-z]/.test(value) ||
                  "The name should start with lowercase letter character."
                );
              },
              illegalEnd: (value) => {
                return (
                  /[a-z0-9]$/.test(value) ||
                  "Then name should end with lowercase alphanumeric character."
                );
              },
            },
            maxLength: {
              value: 63,
              message: "The max length is 63 character.",
            },
          }}
        />
        <Controller
          name={fieldsMap.stack}
          control={control}
          render={({ field }) => (
            <FormControl
              ref={eleList[1]}
              error={errors[fieldsMap.stack] ? true : false}
              className={styles.stacksWrap}
            >
              <h2>
                {fieldsMap.stack}
                <span className={styles.star}>*</span>
              </h2>
              <ul
                className={styles.stacks}
                onClick={() => {
                  calculateUnderBgStyle(1);
                }}
              >
                {stackList.map(({ name, id }) => {
                  const icons = get(stacksMap, name, []);
                  return (
                    <li
                      key={name}
                      onClick={() => {
                        field.onChange(id);
                      }}
                      className={clsx(
                        id === +field.value && styles.chosenStack
                      )}
                    >
                      <div className={styles.icons}>
                        {icons[0] && (
                          <Image
                            src={icons[0]}
                            alt="Without ForkMain"
                            width={35}
                            height={35}
                          />
                        )}
                        {icons[1] && (
                          <Image
                            src={icons[1]}
                            alt="Without ForkMain"
                            width={35}
                            height={35}
                          />
                        )}
                      </div>
                      <Typography align="center" className={styles.stackName}>
                        {name}
                      </Typography>
                    </li>
                  );
                })}
              </ul>
              <div>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.stack] && errors[fieldsMap.stack].message}
                </FormHelperText>
              </div>
            </FormControl>
          )}
          rules={{
            required: "Please choose a stack.",
          }}
        />
        <Controller
          name={fieldsMap.cluster}
          control={control}
          render={({ field }) => (
            <FormControl
              ref={eleList[2]}
              error={errors[fieldsMap.cluster] ? true : false}
              className={styles.clustersWrap}
            >
              <h2>
                {fieldsMap.cluster}
                <span className={styles.star}>*</span>
              </h2>
              <ul
                className={styles.clusters}
                onClick={() => {
                  calculateUnderBgStyle(2);
                }}
              >
                {clusterList.map((cluster) => (
                  <Tooltip title={cluster.status} key={cluster.name}>
                    <li
                      key={cluster.name}
                      onClick={() => {
                        // Cluster status must is active or initializing
                        [
                          ClusterStatus.Active,
                          ClusterStatus.Initializing,
                        ].includes(cluster.status) &&
                          field.onChange(cluster.id);
                      }}
                      className={clsx(
                        cluster.id === +field.value && styles.chosenCluster,
                        ![
                          ClusterStatus.Active,
                          ClusterStatus.Initializing,
                        ].includes(cluster.status) && styles.inactiveCluster
                      )}
                      title={cluster.status}
                    >
                      <div className={styles.clusterIcon}>
                        <Image
                          src={getClusterIcon(
                            cluster.provider as ClusterProvider
                          )}
                          alt=""
                          layout="fill"
                          objectFit="contain"
                        />
                      </div>
                      {cluster.name}
                      {cluster.status === ClusterStatus.Initializing && (
                        <div className={styles.spinner}>
                          <Spinner spinnerColor="#6b6b6b" scale={"17%"} />
                        </div>
                      )}
                    </li>
                  </Tooltip>
                ))}
                <li
                  onClick={() => {
                    setOpenAddClusterDrawer(true);
                  }}
                >
                  <div className={styles.clusterIcon}>
                    <Image
                      src={PlusIcon}
                      alt=""
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  New Cluster
                </li>
              </ul>
              <div>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.cluster] &&
                    errors[fieldsMap.cluster].message}
                </FormHelperText>
              </div>
            </FormControl>
          )}
          rules={{
            required: "Please choose a cluster.",
          }}
        />
        <Controller
          name={fieldsMap.gitProvider}
          control={control}
          render={({ field }) => (
            <FormControl
              ref={eleList[3]}
              error={errors[fieldsMap.gitProvider] ? true : false}
              className={styles.gitProviderWrap}
            >
              <h2>
                {fieldsMap.gitProvider}
                <span className={styles.star}>*</span>
              </h2>
              <div>
                <Select
                  value={field.value}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setOpenAddGitProviderDrawer(true);
                    } else {
                      // Compatible with field.onChange event.
                      setTimeout(() => {
                        calculateUnderBgStyle(3);
                      });
                      field.onChange(e);
                    }
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  // style={{ minWidth: 195 }}
                  className={clsx(styles.gitProviderSelect)}
                  onOpen={() => {
                    calculateUnderBgStyle(3);
                  }}
                >
                  {gitProviderList.map(
                    ({ id, git_org_name, provider, created_at }) => (
                      <MenuItem
                        key={id}
                        value={id}
                        className={styles.gitProviderItem}
                        placeholder="Please choose a git provider."
                      >
                        {provider === GitProvider.GitHub && <GitHubSVG />}
                        <Stack>
                          <div className={styles.gitOrgname}>
                            {git_org_name}
                          </div>
                          <div className={styles.gitProviderUpdate}>
                            {formatDate(created_at * 1000)}
                          </div>
                        </Stack>
                      </MenuItem>
                    )
                  )}
                  <MenuItem value={"new"} className={styles.gitProviderItem}>
                    <AddCircleOutlineIcon />
                    Add
                  </MenuItem>
                </Select>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.gitProvider] &&
                    errors[fieldsMap.gitProvider].message}
                </FormHelperText>
              </div>
            </FormControl>
          )}
          rules={{
            required: "Please choose a git provider.",
          }}
        />

        {/* <Controller
          name={fieldsMap.domain.name}
          control={control}
          render={({ field }) => (
            <FormControl
              ref={eleList[4]}
              error={errors[fieldsMap.domain.name] ? true : false}
              className={styles.domainWrap}
            >
              <h2>
                {fieldsMap.domain.name}
                <span className={styles.star}>*</span>
              </h2>
              <div>
                <TextField
                  onChange={field.onChange}
                  value={field.value}
                  className={clsx(styles.domainInput)}
                  onFocus={() => {
                    calculateUnderBgStyle(4);
                  }}
                  placeholder="Please enter the application domain."
                ></TextField>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.domain.name] &&
                    errors[fieldsMap.domain.name].message}
                </FormHelperText>
              </div>
            </FormControl>
          )}
          rules={{
            required: "Please enter a domain.",
            validate: {
              illegalCharacter: (value) => {
                return (
                  !/[^a-zA-Z0-9\.-]/.test(value) ||
                  "The name only contain alphanumeric character, dot, or hyphen."
                );
              },
              illegalStart: (value) => {
                return (
                  /^[a-zA-Z0-9]/.test(value) ||
                  "The name should start with alphanumeric character."
                );
              },
              illegalEnd: (value) => {
                return (
                  /[a-zA-Z0-9]$/.test(value) ||
                  "Then name should end with alphanumeric character."
                );
              },
            },
          }}
        /> */}
        <div className={styles.submitWrap}>
          <Button type="submit" className={styles.submit} value="CREATE">
            create
          </Button>
        </div>
      </form>
      <NewClusterModal
        setModalDisplay={setOpenAddClusterDrawer}
        successCb={() => {
          setOpenAddClusterDrawer(false);
        }}
        modalDisplay={openAddClusterDrawer}
      />
      <AddGitProvider
        setModalDisplay={setOpenAddGitProviderDrawer}
        modalDisplay={openAddGitProviderDrawer}
        successCb={addGitProviderSuccessCb}
      />
    </Layout>
  );
}
