import React, { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";
import clsx from "clsx";
import { Control, Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import * as yup from "yup";
import ForkRightIcon from "@mui/icons-material/ForkRight";

import {
  fork,
  ForkReq,
  ForkRes,
  ForkType,
  ServiceType,
} from "@/api/application";
import { useBranches } from "@/hooks/branches";
import { CommonProps } from "@/utils/commonType";
import { GetBranchesRes } from "@/api/gitProviders";
import { getQuery, getUrlEncodeName, Message } from "@/utils/utils";
import useEnvSetting from "@/hooks/envSetting";
import { $$ } from "@/utils/console";
import { PanelContext } from "@/utils/contexts";

import styles from "./index.module.scss";
import AddEnvVariables, {
  schema as backendVariableSchema,
} from "../../AddEnvVariables";
import { schema as frontendVariableSchema } from "../../AddEnvVariables";
import AddGitHubIssues, {
  schema as AddGitHubIssuesSchema,
  FieldsMap as AddGitHubIssuesFieldsMap,
} from "../../AddGitHubIssues";
import FormItemEnvType, { schema as EnvTypeSchema } from "../FormItemEnvType";
import FormItemName, { schema as NameSchema } from "../FormItemName";
import {
  SharedFormFieldName,
  SharedFormFieldValues,
  WebAppFormDefaultValue,
  WebAppFormFieldName,
  WebAppFormFieldValues,
} from "../constants";
import { HeadlineOne, HeadlineTwo } from "../Piece";
import { parseDefaultBranchName } from "../utils";

interface Props extends CommonProps {
  forkSuccessCb?: (res: ForkRes) => void;
}

const schema = yup.object().shape({
  [WebAppFormFieldName.ENV_TYPE]: EnvTypeSchema,
  [WebAppFormFieldName.NAME]: NameSchema,
  [WebAppFormFieldName.ISSUES]: AddGitHubIssuesSchema,
  [WebAppFormFieldName.START_POINT]: yup.object().shape({
    [WebAppFormFieldName.BACKEND]: yup
      .string()
      .default("")
      .required("Please choose backend branch."),
    [WebAppFormFieldName.FRONTEND]: yup
      .string()
      .default("")
      .required("Please choose backend branch."),
  }),
  [WebAppFormFieldName.ENV_VARIABLES]: yup.object().shape({
    [WebAppFormFieldName.BACKEND]: backendVariableSchema,
    [WebAppFormFieldName.FRONTEND]: frontendVariableSchema,
  }),
});

export default function ForkEnvForWebApp(props: Props): React.ReactElement {
  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const panelContext = useContext(PanelContext);

  const router = useRouter();
  let app_id = +getQuery("app_id");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<WebAppFormFieldValues>({
    defaultValues: WebAppFormDefaultValue,
    resolver: yupResolver(schema),
  });

  const [frontendBranches] = useBranches({
    git_provider_id: panelContext.git_provider_id!,
    owner_name: panelContext.git_org_name!,
    // repo_name: panelContext.repos?.[1]?.repo_name ?? "",
    repo_name: ""
  });
  const [backendBranches] = useBranches({
    git_provider_id: panelContext.git_provider_id!,
    owner_name: panelContext.git_org_name!,
    // repo_name: panelContext.repos?.[0]?.repo_name ?? "",
    repo_name: ""
  });

  // Set the default branch to "main" or "master".
  useEffect(() => {
    if (frontendBranches.length > 0) {
      const frontendDefaultBranchName =
        parseDefaultBranchName(frontendBranches);
      setValue(
        `${WebAppFormFieldName.START_POINT}.${WebAppFormFieldName.FRONTEND}` as const,
        frontendDefaultBranchName
      );
    }
  }, [frontendBranches]);
  useEffect(() => {
    if (backendBranches.length > 0) {
      const backendDefaultBranchName = parseDefaultBranchName(backendBranches);
      setValue(
        `${WebAppFormFieldName.START_POINT}.${WebAppFormFieldName.BACKEND}`,
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
              ? WebAppFormFieldName.BACKEND
              : WebAppFormFieldName.FRONTEND;
          setValue(
            `${WebAppFormFieldName.ENV_VARIABLES}.${type}`,
            service.setting.env
          );
        }
      });
    }
  }, [envSetting]);

  const switchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAdvancedSettings(event.target.checked);
  };

  const submitHandler: SubmitHandler<WebAppFormFieldValues> = (data) => {
    // Parse issue URLs.
    const issue_urls: Array<string> = [];
    if (
      data[WebAppFormFieldName.ISSUES] &&
      data[WebAppFormFieldName.ISSUES].length >= 1
    ) {
      data[WebAppFormFieldName.ISSUES].map((issue) =>
        issue_urls.push(issue[AddGitHubIssuesFieldsMap.URL])
      );
    }

    // Parse backend and frontend env variables.
    const [backendRepo, frontendRepo] = panelContext.repos!;
    const backendService = {
      name: backendRepo.repo_name,
      repo_url: backendRepo.repo_url,
      setting: {
        env: data[WebAppFormFieldName.ENV_VARIABLES][
          WebAppFormFieldName.BACKEND
        ],
        fork: {
          from: data[WebAppFormFieldName.START_POINT][
            WebAppFormFieldName.BACKEND
          ],
          type: ForkType.branch,
        },
      },
      type: ServiceType.backend,
    };
    const frontendService = {
      name: frontendRepo.repo_name,
      repo_url: frontendRepo.repo_url,
      setting: {
        env: data[WebAppFormFieldName.ENV_VARIABLES][
          WebAppFormFieldName.FRONTEND
        ],
        fork: {
          from: data[WebAppFormFieldName.START_POINT][
            WebAppFormFieldName.FRONTEND
          ],
          type: ForkType.branch,
        },
      },
      type: ServiceType.frontend,
    };

    const req: ForkReq = {
      app_id: app_id,
      body: {
        env_name: data[WebAppFormFieldName.NAME],
        env_type: data[WebAppFormFieldName.ENV_TYPE],
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
      Message.success(
        "Fork a new environment successfully. There will spend about 20s to initialize the environment. ",
        {
          showTime: 7,
        }
      );
    });
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(submitHandler)}>
      <div>
        <FormItemEnvType
          {...{
            control: control as unknown as Control<
              Pick<
                SharedFormFieldValues,
                typeof SharedFormFieldName["ENV_TYPE"]
              >
            >,
          }}
        />
      </div>
      <div className={styles.nameWrap}>
        <HeadlineOne>
          {WebAppFormFieldName.NAME}
          <span>*</span>
        </HeadlineOne>
        <FormItemName
          {...{
            control: control as unknown as Control<
              Pick<SharedFormFieldValues, typeof SharedFormFieldName["NAME"]>
            >,
            error: errors[WebAppFormFieldName.NAME],
          }}
        />
      </div>
      <Controller
        name={WebAppFormFieldName.ISSUES}
        control={control}
        render={({ field }) => (
          <FormControl className={styles.issueWrap}>
            <div style={{ marginTop: "10px" }}>
              <HeadlineOne>{WebAppFormFieldName.ISSUES}</HeadlineOne>
            </div>
            <AddGitHubIssues
              {...{
                control,
                name: WebAppFormFieldName.ISSUES,
                error: errors[WebAppFormFieldName.ISSUES],
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
            <HeadlineOne>{WebAppFormFieldName.START_POINT}:</HeadlineOne>
            <div>
              <HeadlineTwo>
                {WebAppFormFieldName.BACKEND}
                <span>*</span>
              </HeadlineTwo>
              <Controller
                name={`${WebAppFormFieldName.START_POINT}.${WebAppFormFieldName.BACKEND}`}
                control={control}
                render={({ field, fieldState, formState }) => (
                  <FormControl
                    error={
                      errors[WebAppFormFieldName.START_POINT] &&
                      errors[WebAppFormFieldName.START_POINT]![
                        WebAppFormFieldName.BACKEND
                      ] !== undefined
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
                      {errors[WebAppFormFieldName.START_POINT] &&
                        errors[WebAppFormFieldName.START_POINT]![
                          WebAppFormFieldName.BACKEND
                        ]?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
              <HeadlineTwo>
                {WebAppFormFieldName.FRONTEND}
                <span>*</span>
              </HeadlineTwo>
              <Controller
                name={`${WebAppFormFieldName.START_POINT}.${WebAppFormFieldName.FRONTEND}`}
                control={control}
                render={({ field }) => (
                  <FormControl
                    error={
                      errors[WebAppFormFieldName.START_POINT] &&
                      errors[WebAppFormFieldName.START_POINT]![
                        WebAppFormFieldName.FRONTEND
                      ] !== undefined
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
                      {errors[WebAppFormFieldName.START_POINT] &&
                        errors[WebAppFormFieldName.START_POINT]![
                          WebAppFormFieldName.FRONTEND
                        ]?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>
          </div>
          <div className={styles.envVariablesWrap}>
            <HeadlineOne>{WebAppFormFieldName.ENV_VARIABLES}:</HeadlineOne>
            <div className={styles.backendEnvVariablesWrap}>
              <HeadlineTwo>{WebAppFormFieldName.BACKEND}</HeadlineTwo>
              <AddEnvVariables
                {...{
                  control,
                  name: `${WebAppFormFieldName.ENV_VARIABLES}.${WebAppFormFieldName.BACKEND}`,
                  error:
                    errors[WebAppFormFieldName.ENV_VARIABLES] &&
                    errors[WebAppFormFieldName.ENV_VARIABLES]![
                      WebAppFormFieldName.BACKEND
                    ],
                }}
              />
              <HeadlineTwo>{WebAppFormFieldName.FRONTEND}</HeadlineTwo>
              <AddEnvVariables
                {...{
                  control,
                  name: `${WebAppFormFieldName.ENV_VARIABLES}.${WebAppFormFieldName.FRONTEND}`,
                  error:
                    errors[WebAppFormFieldName.ENV_VARIABLES] &&
                    errors[WebAppFormFieldName.ENV_VARIABLES]![
                      WebAppFormFieldName.FRONTEND
                    ],
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

