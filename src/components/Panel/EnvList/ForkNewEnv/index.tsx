import React, { useContext, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/system";
import * as yup from "yup";
import {
  EnvType,
  EnvVariables,
  fork,
  ForkReq,
  ForkRes,
  ForkType,
  ServiceType,
} from "@/api/application";
import { useBranches } from "@/hooks/branches";
import { CommonProps } from "@/utils/commonType";
import { GetBranchesReq } from "@/api/gitProviders";
import { PanelContext } from "@/pages/[organization]/applications/panel";
import { getQuery } from "@/utils/utils";

import styles from "./index.module.scss";
import AddEnvVariables, {
  schema as backendVariableSchema,
} from "../AddEnvVariables";
import { schema as frontendVariableSchema } from "../AddEnvVariables";

interface Props extends CommonProps {
  forkSuccessCb?: (res: ForkRes) => void;
}

enum FieldsMap {
  EnvType = "Env Type",
  Name = "Name",
  StartPoint = "Start Point",
  Backend = "Backend",
  Frontend = "Frontend",
  EnvVariables = "Env Variables",
}

interface FieldsValue {
  [FieldsMap.EnvType]: EnvType;
  [FieldsMap.Name]: string;
  [FieldsMap.StartPoint]: {
    [FieldsMap.Backend]: string;
    [FieldsMap.Frontend]: string;
  };
  [FieldsMap.EnvVariables]: {
    [FieldsMap.Backend]: EnvVariables;
    [FieldsMap.Frontend]: EnvVariables;
  };
}

const defaultBranches = "main";
const DefaultFields: FieldsValue = {
  [FieldsMap.EnvType]: EnvType.Development,
  [FieldsMap.Name]: "",
  [FieldsMap.StartPoint]: {
    [FieldsMap.Backend]: defaultBranches,
    [FieldsMap.Frontend]: defaultBranches,
  },
  [FieldsMap.EnvVariables]: {
    [FieldsMap.Backend]: [],
    [FieldsMap.Frontend]: [],
  },
};

const schema = yup.object().shape({
  [FieldsMap.EnvType]: yup
    .string()
    .oneOf(Object.values(EnvType))
    .required("Please enter the forked environment name."),
  [FieldsMap.Name]: yup
    .string()
    .required("Please enter the forked environment name."),
  [FieldsMap.StartPoint]: yup.object().shape({
    [FieldsMap.Backend]: yup.string().required("Please choose backend branch."),
    [FieldsMap.Frontend]: yup
      .string()
      .required("Please choose backend branch."),
  }),
  [FieldsMap.EnvVariables]: yup.object().shape({
    [FieldsMap.Backend]: backendVariableSchema,
    [FieldsMap.Frontend]: frontendVariableSchema,
  }),
});

export default function ForkNewEnv(props: Props): React.ReactElement {
  let appId = getQuery("app_id");
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);

  const panelContext = useContext(PanelContext);
  const [frontendBranches, flushFrontendBranches] = useBranches({
    git_provider_id: panelContext.git_provider_id!,
    owner_name: panelContext.git_org_name!,
    repo_name: panelContext.repos![1].repo_name,
  });
  const [backendBranches, flushBackendBranches] = useBranches({
    git_provider_id: panelContext.git_provider_id!,
    owner_name: panelContext.git_org_name!,
    repo_name: panelContext.repos![0]!.repo_name,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: DefaultFields,
    resolver: yupResolver(schema),
  });

  const switchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAdvancedSettings(event.target.checked);
  };

  const submitHandler: SubmitHandler<FieldsValue> = (data) => {
    console.log(data);
    const [backendRepo, frontendRepo] = panelContext.repos!;
    const backendService = {
      name: backendRepo.repo_name,
      repo_url: backendRepo.repo_url,
      setting: {
        env: data[FieldsMap.EnvVariables][FieldsMap.Backend],
        fork: {
          from: data[FieldsMap.StartPoint][FieldsMap.Backend],
          type: ForkType.branch,
        },
      },
      type: ServiceType.backend,
    };
    const frontendService = {
      name: frontendRepo.repo_name,
      repo_url: frontendRepo.repo_url,
      setting: {
        env: data[FieldsMap.EnvVariables][FieldsMap.Frontend],
        fork: {
          from: data[FieldsMap.StartPoint][FieldsMap.Frontend],
          type: ForkType.branch,
        },
      },
      type: ServiceType.frontend,
    };

    const req: ForkReq = {
      app_id: +appId,
      body: {
        env_name: data[FieldsMap.Name],
        env_type: data[FieldsMap.EnvType],
        service: [backendService, frontendService],
      },
    };

    fork(req).then((res) => {
      props.forkSuccessCb && props.forkSuccessCb(res);
    });
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(submitHandler)}>
      <Controller
        name={FieldsMap.EnvType}
        control={control}
        render={({ field }) => (
          <FormControl
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: "55px",
            }}
          >
            <HeadlineOne>{FieldsMap.EnvType}</HeadlineOne>
            <RadioGroup row name={FieldsMap.EnvType} value={field.value}>
              <FormControlLabel
                value={EnvType.Test}
                control={<Radio />}
                label={EnvType.Test}
              />
              <FormControlLabel
                value={EnvType.Development}
                control={<Radio />}
                label={EnvType.Development}
              />
            </RadioGroup>
          </FormControl>
        )}
      />
      <Controller
        name={FieldsMap.Name}
        control={control}
        render={({ field }) => (
          <FormControl className={styles.nameWrap}>
            <HeadlineOne>{FieldsMap.Name}</HeadlineOne>
            <TextField
              value={field.value}
              onChange={field.onChange}
              error={errors[FieldsMap.Name] !== undefined}
              helperText={
                errors[FieldsMap.Name] && errors[FieldsMap.Name]?.message
              }
              size="small"
            />
          </FormControl>
        )}
      />
      <Box className={styles.switchWrap}>
        <span>*</span>
        Show Advanced Options
        <Switch checked={showAdvancedSettings} onChange={switchChangeHandler} />
      </Box>
      {showAdvancedSettings && (
        <>
          <div className={styles.startPointWrap}>
            <HeadlineOne>{FieldsMap.StartPoint}:</HeadlineOne>
            <div>
              <HeadlineTwo>{FieldsMap.Backend}</HeadlineTwo>
              <Controller
                name={`${FieldsMap.StartPoint}.${FieldsMap.Backend}`}
                control={control}
                render={({ field, fieldState, formState }) => (
                  <FormControl
                    error={
                      errors[FieldsMap.StartPoint] &&
                      errors[FieldsMap.StartPoint]![FieldsMap.Backend] !==
                        undefined
                    }
                  >
                    <Select
                      size="small"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {backendBranches.map((branch) => (
                        <MenuItem key={branch.name} value={branch.name}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors[FieldsMap.StartPoint] &&
                        errors[FieldsMap.StartPoint]![FieldsMap.Backend]
                          ?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <HeadlineTwo>{FieldsMap.Frontend}</HeadlineTwo>
              <Controller
                name={`${FieldsMap.StartPoint}.${FieldsMap.Frontend}`}
                control={control}
                render={({ field }) => (
                  <FormControl
                    error={
                      errors[FieldsMap.StartPoint] &&
                      errors[FieldsMap.StartPoint]![FieldsMap.Frontend] !==
                        undefined
                    }
                  >
                    <Select
                      size="small"
                      value={field.value}
                      onChange={field.onChange}
                    >
                      {frontendBranches.map((branch) => (
                        <MenuItem key={branch.name} value={branch.name}>
                          {branch.name}
                        </MenuItem>
                      ))}
                    </Select>
                    <FormHelperText>
                      {errors[FieldsMap.StartPoint] &&
                        errors[FieldsMap.StartPoint]![FieldsMap.Frontend]
                          ?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className={styles.envVariablesWrap}>
            <HeadlineOne>{FieldsMap.EnvVariables}:</HeadlineOne>
            <div className={styles.backendEnvVariablesWrap}>
              <HeadlineTwo>{FieldsMap.Backend}</HeadlineTwo>
              <AddEnvVariables
                {...{
                  control,
                  name: `${FieldsMap.EnvVariables}.${FieldsMap.Backend}`,
                  error:
                    errors[FieldsMap.EnvVariables] &&
                    errors[FieldsMap.EnvVariables]![FieldsMap.Backend],
                }}
              />
              <HeadlineTwo>{FieldsMap.Frontend}</HeadlineTwo>
              <AddEnvVariables
                {...{
                  control,
                  name: `${FieldsMap.EnvVariables}.${FieldsMap.Frontend}`,
                  error:
                    errors[FieldsMap.EnvVariables] &&
                    errors[FieldsMap.EnvVariables]![FieldsMap.Frontend],
                }}
              />
            </div>
          </div>
        </>
      )}
      <Button variant="contained" type="submit">
        Fork
      </Button>
      <Button
        variant="outlined"
        onClick={(e) => console.warn(frontendBranches)}
      >
        test
      </Button>
    </form>
  );
}

const HeadlineOne = styled(Typography)<TypographyProps>(() => ({
  fontSize: 15,
  fontWeight: 500,
  fontFamily: "Roboto",
}));

const HeadlineTwo = styled(Typography)<TypographyProps>(() => ({
  fontSize: 14,
  fontFamily: "Roboto",
  color: "#5b7587",
}));

const widthSx = { width: "250px" };

export const IconFocusStyle = {
  background: "#fff",
  borderRadius: "4px",
  ...widthSx,
};
