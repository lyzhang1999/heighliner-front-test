import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { Control, Controller, SubmitHandler, useForm } from "react-hook-form";
import { Box, Button, FormControl, Switch } from "@mui/material";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ForkRightIcon from "@mui/icons-material/ForkRight";
import router from "next/router";

import { CommonProps } from "@/utils/commonType";
import { PanelContext } from "@/utils/contexts";
import {
  fork,
  ForkReq,
  ForkType,
  getEnvSetting,
  ServiceType,
} from "@/api/application";
import { getQuery, getUrlEncodeName, Message } from "@/utils/utils";
import useEnvSetting from "@/hooks/envSetting";

import styles from "./index.module.scss";
import {
  MicroServiceFormDefaultValue,
  MicroServiceFormFieldName,
  MicroServiceFormFieldValues,
  SharedFormFieldName,
  SharedFormFieldValues,
} from "../constants";
import FormItemName, { schema as NameSchema } from "../FormItemName";
import FormItemEnvType, { schema as EnvTypeSchema } from "../FormItemEnvType";
import AddEnvVariables, {
  schema as EnvVariableSchema,
} from "../../AddEnvVariables";
import AddGitHubIssues, {
  schema as AddGitHubIssuesSchema,
  FieldsMap as AddGitHubIssuesFieldsMap,
} from "../../AddGitHubIssues";
import { HeadlineOne, HeadTitle2 } from "../Piece";
import { $$ } from "@/utils/console";
import StartPoint from "./StartPoint";
import { getBranches } from "@/api/gitProviders";
import { parseDefaultBranchName } from "../utils";
import useAppSettings from "@/hooks/applicationSettings";

interface Props extends CommonProps {}

const schema: yup.SchemaOf<MicroServiceFormFieldValues> = yup.object().shape({
  [MicroServiceFormFieldName.ENV_TYPE]: EnvTypeSchema,
  [MicroServiceFormFieldName.NAME]: NameSchema,
  [MicroServiceFormFieldName.ISSUES]: AddGitHubIssuesSchema,
  [MicroServiceFormFieldName.START_POINT]: yup.array().of(
    yup.object().shape({
      [MicroServiceFormFieldName.SERVICE_NAME]: yup.string().required(),
      [MicroServiceFormFieldName.BRANCH_NAME]: yup.string().required(),
    })
  ),
  [MicroServiceFormFieldName.ENV_VARIABLES]: yup.array().of(
    yup.object().shape({
      [MicroServiceFormFieldName.SERVICE_NAME]: yup.string().required(),
      [MicroServiceFormFieldName.ENV_VARIABLES]: EnvVariableSchema,
    })
  ),
});

export default function ForkEnvForMicroService(
  props: Props
): React.ReactElement {
  const panelContext = useContext(PanelContext);
  const app_id = +getQuery("app_id");

  const [appSettings] = useAppSettings(app_id);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<MicroServiceFormFieldValues>({
    defaultValues: MicroServiceFormDefaultValue,
    resolver: yupResolver(schema),
  });

  // Add initial default repository name and branch.
  // useEffect(() => {
  //   panelContext.repos?.map(async (repo, index) => {
  //     const res = await getBranches({
  //       git_provider_id: panelContext.git_provider_id!,
  //       owner_name: panelContext.git_org_name!,
  //       repo_name: repo.repo_name,
  //     });

  //     const defaultBranchName = parseDefaultBranchName(res);

  //     setValue(`${MicroServiceFormFieldName.START_POINT}.${index}`, {
  //       [MicroServiceFormFieldName.REPO_NAME]: repo.repo_name,
  //       [MicroServiceFormFieldName.BRANCH_NAME]: defaultBranchName,
  //     });
  //   });
  // }, [panelContext.repos]);
  useEffect(() => {
    appSettings?.service?.map((service, index) => {
      setValue(`${MicroServiceFormFieldName.START_POINT}.${index}`, {
        [MicroServiceFormFieldName.SERVICE_NAME]: service.name,
        [MicroServiceFormFieldName.BRANCH_NAME]: "main",
      });
    });
  }, [appSettings]);

  // Add initial env variables.
  // useEffect(() => {
  //   getEnvSetting({
  //     app_id,
  //     env_id: panelContext.prodEnvId!,
  //   }).then((res) => {
  //     const services = res?.application?.service;

  //     panelContext.repos?.map((repo, index) => {
  //       const targetService = services.find(
  //         (service) => service.name === repo.repo_name
  //       );

  //       // Filter some undesired env variables.
  //       const env =
  //         targetService?.setting?.env?.filter(
  //           (env) => !["ENV_DOMAIN", "ENV_NAME"].includes(env.name)
  //         ) || [];

  //       setValue(`${MicroServiceFormFieldName.ENV_VARIABLES}.${index}`, {
  //         [MicroServiceFormFieldName.REPO_NAME]: repo.repo_name,
  //         [MicroServiceFormFieldName.ENV_VARIABLES]: env,
  //       });
  //     });
  //   });
  // }, [panelContext.repos]);
  useEffect(() => {
    appSettings?.service?.map((service, index) => {
      setValue(`${MicroServiceFormFieldName.ENV_VARIABLES}.${index}`, {
        [MicroServiceFormFieldName.SERVICE_NAME]: service.name ?? "",
        [MicroServiceFormFieldName.ENV_VARIABLES]: service.env ?? [],
      });
    });
  }, [appSettings]);

  const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
  const switchChangeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setShowAdvancedSettings(event.target.checked);
  };

  const submitHandler: SubmitHandler<MicroServiceFormFieldValues> = async (
    data
  ) => {
    // Parse issue URLs.
    const issue_urls: Array<string> = [];
    if (
      data[MicroServiceFormFieldName.ISSUES] &&
      data[MicroServiceFormFieldName.ISSUES].length >= 1
    ) {
      data[MicroServiceFormFieldName.ISSUES].map((issue) =>
        issue_urls.push(issue[AddGitHubIssuesFieldsMap.URL])
      );
    }

    // Parse env variables.
    $$.fold(data);
    const service: ForkReq["body"]["service"] = data[
      MicroServiceFormFieldName.ENV_VARIABLES
    ].map((envVariables) => {
      return {
        name: envVariables[MicroServiceFormFieldName.SERVICE_NAME],
        repo_url:
          appSettings?.service?.find(
            (service) =>
              service?.name ===
              envVariables[MicroServiceFormFieldName.SERVICE_NAME]
          )?.repo?.html_url ?? "",
        setting: {
          env: envVariables[MicroServiceFormFieldName.ENV_VARIABLES],
          fork: {
            // from: data[MicroServiceFormFieldName.START_POINT].find(
            //   (startPoint) =>
            //     envVariables[MicroServiceFormFieldName.REPO_NAME] ===
            //     startPoint[MicroServiceFormFieldName.REPO_NAME]
            // )![MicroServiceFormFieldName.BRANCH_NAME],
            from: "main",
            type: ForkType.branch,
          },
        },
        type: ServiceType.backend,
      };
    });

    // Compose service
    // const res = await getEnvSetting({
    //   app_id,
    //   env_id: panelContext.prodEnvId!,
    // });

    // const service: ForkReq["body"]["service"] =
    //   res?.operator_web_app?.spec?.service?.map((service) => ({
    //     name: service.name,
    //     repo_url: "",
    //     setting: {
    //       env: service.env ?? [],
    //       fork: {
    //         from: "main",
    //         type: ForkType.branch,
    //       },
    //     },
    //     type: ServiceType.backend,
    //   }));

    const req: ForkReq = {
      app_id: app_id,
      body: {
        env_name: data[MicroServiceFormFieldName.NAME],
        env_type: data[MicroServiceFormFieldName.ENV_TYPE],
        issue_urls,
        service,
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
          {SharedFormFieldName.NAME}
          <span>*</span>
        </HeadlineOne>
        <FormItemName
          {...{
            control: control as unknown as Control<
              Pick<SharedFormFieldValues, typeof SharedFormFieldName["NAME"]>
            >,
            error: errors[MicroServiceFormFieldName.NAME],
          }}
        />
      </div>
      <Controller
        name={SharedFormFieldName.ISSUES}
        control={control}
        render={({ field }) => (
          <FormControl className={styles.issueWrap}>
            <div style={{ marginTop: "10px" }}>
              <HeadlineOne>{SharedFormFieldName.ISSUES}</HeadlineOne>
            </div>
            <AddGitHubIssues
              {...{
                control,
                name: SharedFormFieldName.ISSUES,
                error: errors[SharedFormFieldName.ISSUES],
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
            <HeadlineOne>{MicroServiceFormFieldName.START_POINT}:</HeadlineOne>
            <StartPoint
              {...{
                name: MicroServiceFormFieldName.START_POINT,
                control,
                error: errors[MicroServiceFormFieldName.START_POINT],
              }}
            />
          </div>
          <div className={styles.envVariablesWrap}>
            <HeadlineOne>
              {MicroServiceFormFieldName.ENV_VARIABLES}:
            </HeadlineOne>
            <Controller
              name={`${MicroServiceFormFieldName.ENV_VARIABLES}`}
              control={control}
              render={({ field: envVariableList }) => (
                <div>
                  {envVariableList.value.map((envVariableItem, index) => (
                    <div key={index}>
                      <HeadTitle2
                        toolTipTitle={
                          envVariableItem[
                            MicroServiceFormFieldName.SERVICE_NAME
                          ]
                        }
                      >
                        {
                          envVariableItem[
                            MicroServiceFormFieldName.SERVICE_NAME
                          ]
                        }
                      </HeadTitle2>
                      <AddEnvVariables
                        key={index}
                        {...{
                          control,
                          name: `${MicroServiceFormFieldName.ENV_VARIABLES}.${index}.${MicroServiceFormFieldName.ENV_VARIABLES}`,
                          error:
                            errors?.[MicroServiceFormFieldName.ENV_VARIABLES]?.[
                              index
                            ]?.[MicroServiceFormFieldName.ENV_VARIABLES],
                        }}
                      />
                    </div>
                  ))}
                </div>
              )}
            />
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
