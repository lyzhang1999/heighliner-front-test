import React, { useContext, useEffect, useState } from "react";
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
import ForkRightIcon from "@mui/icons-material/ForkRight";

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
import { GetBranchesReq, GetBranchesRes } from "@/api/gitProviders";
import { PanelContext } from "@/pages/[organization]/applications/panel";
import { getQuery, getUrlEncodeName } from "@/utils/utils";
import useEnvSetting from "@/hooks/envSetting";

import styles from "./index.module.scss";
import AddEnvVariables, {
  schema as backendVariableSchema,
} from "../AddEnvVariables";
import { schema as frontendVariableSchema } from "../AddEnvVariables";
import AddGitHubIssues, {
  schema as AddGitHubIssuesSchema,
  FieldsMap as AddGitHubIssuesFieldsMap,
} from "../AddGitHubIssues";
import { $$ } from "@/utils/console";

interface Props extends CommonProps {
  forkSuccessCb?: (res: ForkRes) => void;
}

const FieldsMap = {
  EnvType: "Env Type",
  Name: "Name",
  Issues: "Issues",
  URL: "URL",
  StartPoint: "Start Point",
  Backend: "Backend",
  Frontend: "Frontend",
  EnvVariables: "Env Variables",
} as const;

interface FieldsValue {
  [FieldsMap.EnvType]: EnvType;
  [FieldsMap.Name]: string;
  [FieldsMap.Issues]: Array<{
    [AddGitHubIssuesFieldsMap.URL]: string;
  }>;
  [FieldsMap.StartPoint]: {
    [FieldsMap.Backend]: string;
    [FieldsMap.Frontend]: string;
  };
  [FieldsMap.EnvVariables]: {
    [FieldsMap.Backend]: EnvVariables;
    [FieldsMap.Frontend]: EnvVariables;
  };
}

const DefaultFields: FieldsValue = {
  [FieldsMap.EnvType]: EnvType.Development,
  [FieldsMap.Name]: "",
  [FieldsMap.Issues]: [],
  [FieldsMap.StartPoint]: {
    [FieldsMap.Backend]: "",
    [FieldsMap.Frontend]: "",
  },
  [FieldsMap.EnvVariables]: {
    [FieldsMap.Backend]: [],
    [FieldsMap.Frontend]: [],
  },
};

const schema = yup.object().shape({
  [FieldsMap.EnvType]: yup
    .string()
    .default("")
    .oneOf(Object.values(EnvType))
    .required("Please choose the forked environment type."),
  [FieldsMap.Name]: yup
    .string()
    .default("")
    .required("Please enter the forked environment name.")
    .trim()
    .max(63, "The max length is 63 character.")
    .matches(/^[a-z]/, "The name should start with lowercase letter character.")
    .matches(
      /[a-z0-9]$/,
      "Then name should end with lowercase alphanumeric character."
    )
    .test(
      "exclude illegal characters",
      "The name should only contain lowercase alphanumeric character, or hyphen(-).",
      (value) => !/[^a-z0-9-]/.test(value)
    ),
  [FieldsMap.Issues]: AddGitHubIssuesSchema,
  [FieldsMap.StartPoint]: yup.object().shape({
    [FieldsMap.Backend]: yup
      .string()
      .default("")
      .required("Please choose backend branch."),
    [FieldsMap.Frontend]: yup
      .string()
      .default("")
      .required("Please choose backend branch."),
  }),
  [FieldsMap.EnvVariables]: yup.object().shape({
    [FieldsMap.Backend]: backendVariableSchema,
    [FieldsMap.Frontend]: frontendVariableSchema,
  }),
});

export default function ForkNewEnv(props: Props): React.ReactElement {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const panelContext = useContext(PanelContext);

  const router = useRouter();
  let app_id = +getQuery("app_id");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldsValue>({
    defaultValues: DefaultFields,
    resolver: yupResolver(schema),
  });

  const [frontendBranches] = useBranches({
    git_provider_id: panelContext.git_provider_id!,
    owner_name: panelContext.git_org_name!,
    repo_name: panelContext.repos![1].repo_name,
  });
  const [backendBranches] = useBranches({
    git_provider_id: panelContext.git_provider_id!,
    owner_name: panelContext.git_org_name!,
    repo_name: panelContext.repos![0]!.repo_name,
  });

  // Set the default branch to "main" or "master".
  useEffect(() => {
    if (frontendBranches.length > 0) {
      const frontendDefaultBranchName =
        parseDefaultBranchName(frontendBranches);
      setValue(
        `${FieldsMap.StartPoint}.${FieldsMap.Frontend}` as const,
        frontendDefaultBranchName
      );
    }
  }, [frontendBranches]);
  useEffect(() => {
    if (backendBranches.length > 0) {
      const backendDefaultBranchName = parseDefaultBranchName(backendBranches);
      setValue(
        `${FieldsMap.StartPoint}.${FieldsMap.Backend}`,
        backendDefaultBranchName
      );
    }
  }, [backendBranches]);

  // Set the default env variable.
  const [envSetting] = useEnvSetting({
    app_id: app_id,
    env_id: panelContext.prodEnvId!,
  });
  useEffect(() => {
    if (
      envSetting &&
      envSetting.application &&
      envSetting.application.service &&
      envSetting.application.service.length > 0
    ) {
      envSetting.application.service.map((service) => {
        if (
          service.setting &&
          service.setting.env &&
          service.setting.env.length > 0
        ) {
          const type =
            service.type === ServiceType.backend
              ? FieldsMap.Backend
              : FieldsMap.Frontend;
          setValue(`${FieldsMap.EnvVariables}.${type}`, service.setting.env);
        }
      });
    }
  }, [envSetting]);

  const switchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAdvancedSettings(event.target.checked);
  };

  const submitHandler: SubmitHandler<FieldsValue> = (data) => {
    // Parse issue URLs.
    const issue_urls: Array<string> = [];
    if (data[FieldsMap.Issues] && data[FieldsMap.Issues].length >= 1) {
      data[FieldsMap.Issues].map((issue) =>
        issue_urls.push(issue[AddGitHubIssuesFieldsMap.URL])
      );
    }

    // Parse backend and frontend env variables.
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
      app_id: app_id,
      body: {
        env_name: data[FieldsMap.Name],
        env_type: data[FieldsMap.EnvType],
        issue_urls,
        service: [backendService, frontendService],
      },
    };

    fork(req).then((res) => {
      router.push(
        `/${getUrlEncodeName()}/applications/panel/env?app_id=${app_id}&release_id=${
          res.application_release_id
        }&env_id=${res.application_env_id}`
      );
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
          </FormControl>
        )}
      />
      <Controller
        name={FieldsMap.Name}
        control={control}
        render={({ field }) => (
          <FormControl className={styles.nameWrap}>
            <HeadlineOne>
              {FieldsMap.Name}
              <span>*</span>
            </HeadlineOne>
            <TextField
              value={field.value}
              onChange={field.onChange}
              error={errors[FieldsMap.Name] !== undefined}
              helperText={
                errors[FieldsMap.Name] && errors[FieldsMap.Name]?.message
              }
              size="small"
              placeholder="The new forked environment(branch) name"
              autoFocus
            />
          </FormControl>
        )}
      />
      <Controller
        name={FieldsMap.Issues}
        control={control}
        render={({ field }) => (
          <FormControl className={styles.issueWrap}>
            <div style={{ marginTop: "10px" }}>
              <HeadlineOne>{FieldsMap.Issues}</HeadlineOne>
            </div>
            <AddGitHubIssues
              {...{
                control,
                name: FieldsMap.Issues,
                error: errors[FieldsMap.Issues],
              }}
            />
          </FormControl>
        )}
      />
      <Box className={styles.switchWrap}>
        Show Advanced Options
        <Switch checked={showAdvancedSettings} onChange={switchChangeHandler} />
      </Box>
      {showAdvancedSettings && (
        <div className={styles.advancedSettingsWrap}>
          <div className={styles.startPointWrap}>
            <HeadlineOne>{FieldsMap.StartPoint}:</HeadlineOne>
            <div>
              <HeadlineTwo>
                {FieldsMap.Backend}
                <span>*</span>
              </HeadlineTwo>
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
              <HeadlineTwo>
                {FieldsMap.Frontend}
                <span>*</span>
              </HeadlineTwo>
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
        </div>
      )}
      <div>
        <Button
          variant="outlined"
          sx={{
            width: "100%",
            marginTop: "10px",
            marginBottom: "20px",
            gridColumn: "span 2",
            height: "45px",
          }}
          type="submit"
        >
          <ForkRightIcon />
          Fork
        </Button>
      </div>
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

function parseDefaultBranchName(data: GetBranchesRes) {
  const defaultBranches = ["main", "master"];
  const result = data.filter((datum) => {
    return defaultBranches.includes(datum.name.toLowerCase());
  });

  return result[0].name;
}
