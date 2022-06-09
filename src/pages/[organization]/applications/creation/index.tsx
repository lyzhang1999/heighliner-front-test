import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import {
  Button,
  FormControl,
  FormHelperText,
  Input,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import clsx from "clsx";

import Layout from "@/components/Layout";
import { Clusters, getClusterList } from "@/utils/api/cluster";
import { getStacks, Stacks } from "@/utils/api/stack";

import styles from "./index.module.scss";
import { getGitProviderList, GitProviders } from "@/utils/api/gitProvider";
import NewClusterModal from "@/components/NewClusterModal";
import NewGitProvider from "@/components/Application/NewGitProvider";

type FieldsDataType = typeof DefaultFieldsData;

const fieldsMap = {
  applicationName: {
    name: "application name",
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

const [GinIcon, NextIcon, SpringIcon, VueIcon, RemixIcon] = [
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Gin%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Nextjs%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Spring%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Vue%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Remix%403x.webp",
];

const stacksMap: { [index: string]: string[] } = {
  ["gin-next"]: [GinIcon, NextIcon],
  ["spring-vue"]: [SpringIcon, VueIcon],
  ["gin-vue"]: [GinIcon, VueIcon],
  ["remix"]: [RemixIcon],
  ["gin"]: [GinIcon],
};

export default function Index(): React.ReactElement {
  const [openAddClusterDrawer, setOpenAddClusterDrawer] = useState(false);
  const [openAddGitProviderDrawer, setOpenAddGitProviderDrawer] =
    useState(false);

  const [stacks, setStacks] = useState<Stacks>([]);
  const [clusters, setClusters] = useState<Clusters>([]);
  const [gitProviders, setGitProviders] = useState<GitProviders>([]);

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

  // Get the form in need
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<FieldsDataType>({
    defaultValues: DefaultFieldsData,
  });

  const onSubmit: SubmitHandler<FieldsDataType> = (data) => {
    console.log(data);
    console.error(errors);
  };

  const log = () => {
    // console.log(data);
    console.error(errors);
  };

  return (
    <Layout pageHeader="Create Application">
      <div className={styles.panel}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Controller
            name={fieldsMap.applicationName.name}
            control={control}
            render={({ field, fieldState }) => (
              <FormControl
                error={errors[fieldsMap.applicationName.name] ? true : false}
              >
                <h1>
                  {fieldsMap.applicationName.name}
                  <span>*</span>
                </h1>
                <TextField
                  onChange={field.onChange}
                  value={field.value}
                  className={clsx(styles.conformity)}
                ></TextField>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.applicationName.name] &&
                    errors[fieldsMap.applicationName.name].message}
                </FormHelperText>
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
                    /[a-z0-9]/.test(value) ||
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
              <FormControl error={errors[fieldsMap.stack.name] ? true : false}>
                <h1>{fieldsMap.stack.name}</h1>
                <ul className={styles.stacks}>
                  {stacks.map(({ name, id }) => {
                    const icons = stacksMap[name];
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
                          <Image
                            src={icons[0]}
                            alt="Without Heighliner"
                            width={35}
                            height={35}
                            loader={({ src }) => src}
                            // layout="fill"
                          />
                          {icons[1] && (
                            <Image
                              src={icons[1]}
                              alt="Without Heighliner"
                              loader={({ src }) => src}
                              width={35}
                              height={35}
                              // layout="fill"
                            />
                          )}
                        </div>
                        <Typography align="center" className={styles.stackName}>{name}</Typography>
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
                error={errors[fieldsMap.cluster.name] ? true : false}
              >
                <h1>{fieldsMap.cluster.name}</h1>
                <Select
                  value={field.value}
                  onChange={(e) => {
                    if (e.target.value === "new") {
                      setOpenAddClusterDrawer(true);
                    } else {
                      field.onChange(e);
                    }
                  }}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  // name={AllFieldName.Cluster}
                  // style={{ minWidth: 195 }}
                  className={clsx(styles.conformity)}
                >
                  {clusters.map(({ id, name }) => (
                    <MenuItem key={id} value={id}>
                      {name}
                    </MenuItem>
                  ))}
                  <MenuItem value={"new"}>
                    <AddCircleOutlineIcon />
                    &nbsp; Add
                  </MenuItem>
                </Select>
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
          <h1>{fieldsMap.gitProvider.name}</h1>
          <Controller
            name={fieldsMap.gitProvider.name}
            control={control}
            render={({ field }) => (
              <FormControl
                error={errors[fieldsMap.gitProvider.name] ? true : false}
              >
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
                  className={clsx(styles.conformity)}
                >
                  {gitProviders.map(({ id, git_org_name }) => (
                    <MenuItem key={id} value={id}>
                      {git_org_name}
                    </MenuItem>
                  ))}
                  <MenuItem value={"new"}>
                    <AddCircleOutlineIcon />
                    &nbsp; Add
                  </MenuItem>
                </Select>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.gitProvider.name] &&
                    errors[fieldsMap.gitProvider.name].message}
                </FormHelperText>
              </FormControl>
            )}
            rules={{
              required: "Please choose a git provider.",
            }}
          />
          <h1>{fieldsMap.domain.name}</h1>
          <Controller
            name={fieldsMap.domain.name}
            control={control}
            render={({ field }) => (
              <FormControl error={errors[fieldsMap.domain.name] ? true : false}>
                <TextField
                  onChange={field.onChange}
                  value={field.value}
                  className={clsx(styles.conformity)}
                ></TextField>
                <FormHelperText id="my-helper-text">
                  {errors[fieldsMap.domain.name] &&
                    errors[fieldsMap.domain.name].message}
                </FormHelperText>
              </FormControl>
            )}
            rules={{
              required: "Please enter a domain.",
            }}
          />
          <div className={styles.submitWrap}>
            <Input type="submit" className={styles.submit} value="CREATE" />
          </div>
        </form>
      </div>
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
