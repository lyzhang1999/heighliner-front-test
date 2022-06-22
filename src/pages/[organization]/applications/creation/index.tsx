import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
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
  ClusterProvider,
  Clusters,
  ClusterStatus,
  getCluster,
  getClusterList,
} from "@/utils/api/cluster";
import { getStacks, Stacks } from "@/utils/api/stack";

import styles from "./index.module.scss";
import {
  getGitProviderList,
  GitHubProvider,
  GitProviders,
} from "@/utils/api/gitProvider";
import NewClusterModal from "@/components/NewClusterModal";
import NewGitProvider from "@/components/Application/NewGitProvider";
import {
  createApplication,
  CreateApplicationRequest,
} from "@/utils/api/application";
import { useRouter } from "next/router";
import { Context } from "@/utils/store";
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
import { style } from "@mui/system";

type FieldsDataType = typeof DefaultFieldsData;

const fieldsMap = {
  applicationName: {
    name: "name",
  },
  stack: {
    name: "stack",
  },
  cluster: {
    name: "clusters",
  },
  gitProvider: {
    name: "git provider",
  },
  domain: {
    name: "domain",
  },
};

const DefaultFieldsData = {
  [fieldsMap.applicationName.name]: "",
  [fieldsMap.stack.name]: "",
  [fieldsMap.cluster.name]: "",
  [fieldsMap.gitProvider.name]: "",
  [fieldsMap.domain.name]: "",
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

  const [stacks, setStacks] = useState<Stacks>([]);
  const [clusters, setClusters] = useState<Clusters>([]);
  const [gitProviders, setGitProviders] = useState<GitProviders>([]);

  const router = useRouter();

  // Used by calculate in Slide blue Background
  const eleList = [
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
    useRef<HTMLDivElement | null>(null),
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

  // Fetch the stack list and cluster list
  useEffect(() => {
    getStacks().then((res) => {
      setStacks(res);
    });
    getClusterList().then((res) => {
      setClusters(res);
    });
    getGitProviderList().then((res) => {
      setGitProviders(res);
    });
  }, []);

  // When open add cluster or git provider drawer, updating data.
  useEffect(() => {
    getClusterList().then((res) => {
      setClusters(res);
    });
  }, [openAddClusterDrawer]);
  useEffect(() => {
    getGitProviderList().then((res) => {
      setGitProviders(res);
    });
  }, [openAddGitProviderDrawer]);

  // Get the form in need
  const {
    handleSubmit,
    control,
    formState: { errors },
    watch,
  } = useForm<FieldsDataType>({
    defaultValues: DefaultFieldsData,
  });

  const onSubmit: SubmitHandler<FieldsDataType> = async (data) => {
    // Check the cluster status
    const cluster_id = +data[fieldsMap.cluster.name];
    const cluster = clusters.find((cluster) => cluster.id === cluster_id);
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

    // Get git_config's org_name, provider and token
    const git_provider_id = +data[fieldsMap.gitProvider.name];
    const git_config = gitProviders.find(
      (gitProvider) => git_provider_id === gitProvider.id
    );

    const createApplicationRequest: CreateApplicationRequest = {
      cluster_id: +data[fieldsMap.cluster.name],
      git_config: {
        org_name: git_config!.git_org_name,
        provider: git_config!.provider,
        token: git_config!.token,
      },
      name: data[fieldsMap.applicationName.name],
      networking: {
        domain: data[fieldsMap.domain.name],
      },
      stack_id: +data[fieldsMap.stack.name],
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
    <Layout>
      {/* <div className={styles.panel}> */}
      <form onSubmit={handleSubmit(onSubmit)} className={styles.panel}>
        <Typography variant="h1">New Application</Typography>
        <div className={styles.underBackground} style={underBgStyle}></div>
        <Controller
          name={fieldsMap.applicationName.name}
          control={control}
          render={({ field, fieldState }) => (
            <FormControl
              ref={eleList[0]}
              error={errors[fieldsMap.applicationName.name] ? true : false}
              className={styles.applicationNameWrap}
            >
              <h2 className={styles.applicationName}>
                {fieldsMap.applicationName.name}
                <span>*</span>
              </h2>
              <div>
                <TextField
                  onChange={field.onChange}
                  value={field.value}
                  className={clsx(styles.applicationNameInput)}
                  onFocus={() => {
                    calculateUnderBgStyle(0);
                  }}
                ></TextField>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.applicationName.name] &&
                    errors[fieldsMap.applicationName.name].message}
                </FormHelperText>
              </div>
            </FormControl>
          )}
          rules={{
            required: "Please enter your application name.",
            validate: {
              illegalCharacter: (value) => {
                return (
                  !/[^a-z0-9\.-]/.test(value) ||
                  "The name only contain lowercase alphanumeric character, dot, or hyphen."
                );
              },
              illegalStart: (value) => {
                return (
                  /^[a-z0-9]/.test(value) ||
                  "The name should start with lowercase alphanumeric character."
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
              value: 253,
              message: "The max length is 253 character.",
            },
          }}
        />
        <Controller
          name={fieldsMap.stack.name}
          control={control}
          render={({ field }) => (
            <FormControl
              ref={eleList[1]}
              error={errors[fieldsMap.stack.name] ? true : false}
              className={styles.stacksWrap}
            >
              <h2>
                {fieldsMap.stack.name}
                <span>*</span>
              </h2>
              <ul
                className={styles.stacks}
                onClick={() => {
                  calculateUnderBgStyle(1);
                }}
              >
                {stacks.map(({ name, id }) => {
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
              <FormHelperText id="my-helper-text">
                {errors[fieldsMap.stack.name] &&
                  errors[fieldsMap.stack.name].message}
              </FormHelperText>
            </FormControl>
          )}
          rules={{
            required: "Please choose a stack.",
          }}
        />
        <Controller
          name={fieldsMap.cluster.name}
          control={control}
          render={({ field }) => (
            <FormControl
              ref={eleList[2]}
              error={errors[fieldsMap.cluster.name] ? true : false}
              className={styles.clustersWrap}
            >
              <h2>
                {fieldsMap.cluster.name}
                <span>*</span>
              </h2>
              <ul
                className={styles.clusters}
                onClick={() => {
                  calculateUnderBgStyle(2);
                }}
              >
                {clusters.map((cluster) => (
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
                      // height="25px"
                      // width="100%"
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  New Cluster
                </li>
              </ul>
              <FormHelperText id="my-helper-text">
                {errors[fieldsMap.cluster.name] &&
                  errors[fieldsMap.cluster.name].message}
              </FormHelperText>
            </FormControl>
          )}
          rules={{
            required: "Please choose a cluster.",
          }}
        />
        <Controller
          name={fieldsMap.gitProvider.name}
          control={control}
          render={({ field }) => (
            <FormControl
              ref={eleList[3]}
              error={errors[fieldsMap.gitProvider.name] ? true : false}
              className={styles.gitProviderWrap}
            >
              <h2>
                {fieldsMap.gitProvider.name}
                <span>*</span>
              </h2>
              <div>
                <Select
                  value={field.value}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setOpenAddGitProviderDrawer(true);
                    } else {
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
                  {gitProviders.map(
                    ({ id, git_org_name, provider, updated_at }) => (
                      <MenuItem
                        key={id}
                        value={id}
                        className={styles.gitProviderItem}
                      >
                        {provider === GitHubProvider.GITHUB && <GitHubSVG />}
                        <Stack>
                          <div className={styles.gitOrgname}>
                            {git_org_name}
                          </div>
                          <div className={styles.gitProviderUpdate}>
                            {formatDate(updated_at * 1000)}
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
                  {errors[fieldsMap.gitProvider.name] &&
                    errors[fieldsMap.gitProvider.name].message}
                </FormHelperText>
              </div>
            </FormControl>
          )}
          rules={{
            required: "Please choose a git provider.",
          }}
        />

        <Controller
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
                <span>*</span>
              </h2>
              <div>
                <TextField
                  onChange={field.onChange}
                  value={field.value}
                  className={clsx(styles.domainInput)}
                  onFocus={() => {
                    calculateUnderBgStyle(4);
                  }}
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
        />
        <div className={styles.submitWrap}>
          <Button type="submit" className={styles.submit} value="CREATE">
            CREATE
          </Button>
        </div>
      </form>
      {/* </div> */}
      <NewClusterModal
        setModalDisplay={setOpenAddClusterDrawer}
        modalDisplay={openAddClusterDrawer}
      />
      <NewGitProvider
        setModalDisplay={setOpenAddGitProviderDrawer}
        modalDisplay={openAddGitProviderDrawer}
      />
    </Layout>
  );
}
