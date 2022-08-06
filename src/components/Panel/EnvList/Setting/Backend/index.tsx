import React, { useEffect, useState } from "react";
import clsx from "clsx";
import { Button, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { CommonProps } from "@/utils/commonType";
import { getQuery, Message } from "@/utils/utils";
import useEnvSetting from "@/hooks/envSetting";
import {
  EnvVariables,
  ServiceType,
  updateEnvSetting,
  UpdateEnvSettingReq,
} from "@/api/application";

import styles from "./index.module.scss";
import AddEnvVariables from "../../AddEnvVariables";
import { SubmitHandler, useForm } from "react-hook-form";
import { schema } from "../../AddEnvVariables";

interface Props extends CommonProps {}

interface FieldsValue {
  backend: EnvVariables;
}

export default function Backend(props: Props) {
  const app_id = +getQuery("app_id");
  const env_id = +getQuery("env_id");

  const [envSetting, flushEnvSetting] = useEnvSetting({
    app_id: app_id,
    env_id: env_id,
  });
  const [envVariables, setEnvVariables] = useState<EnvVariables>();
  const [name, setName] = useState("");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldsValue>({
    defaultValues: {
      backend: [],
    },
    resolver: yupResolver(
      yup.object().shape({
        backend: schema,
      })
    ),
  });

  useEffect(() => {
    // Parse env variables from envSetting.
    if (
      envSetting &&
      envSetting.application &&
      envSetting.application.service
    ) {
      const services = envSetting.application.service;
      const backendService = services.find(
        (service) => service.type === ServiceType.backend
      );
      setName(backendService?.name ?? "");

      if (
        backendService &&
        backendService.setting &&
        backendService.setting.env
      ) {
        const envVariables = backendService.setting.env;
        console.log(backendService.setting.env);
        setEnvVariables(envVariables);
        setValue("backend", envVariables);
      }
    }
  }, [envSetting]);

  useEffect(() => {
    // getEnvSetting({
    //   app_id: +app_id,
    //   env_id: +env_id,
    // }).then((envSetting) => {
    //   // Parse env variables from envSetting.
    //   if (
    //     envSetting &&
    //     envSetting.application &&
    //     envSetting.application.service
    //   ) {
    //     const services = envSetting.application.service;
    //     const backendService = services.find(
    //       (service) => service.type === ServiceType.backend
    //     );
    //     if (
    //       backendService &&
    //       backendService.setting &&
    //       backendService.setting.env
    //     ) {
    //       const envVariables = backendService.setting.env;
    //       console.log(backendService.setting.env);
    //       setEnvVariables(envVariables);
    //       setValue("backend", envVariables);
    //     }
    //   }
    // });
  }, []);

  const submitHandler: SubmitHandler<FieldsValue> = (data) => {
    const req: UpdateEnvSettingReq = {
      app_id: app_id,
      env_id: env_id,
      body: {
        service: [
          {
            env: data.backend,
            name: name,
          },
        ],
      },
    };
    updateEnvSetting(req).then(() => {
      Message.success("Update Backend's settings successfully.");
    });
  };
  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(submitHandler)}>
      <Typography
        sx={{
          fontFamily: "Roboto",
          fontSize: "15px",
          fontWeight: 500,
          lineHeight: 1.4,
          color: "#303133",
        }}
      >
        Env Variables:
      </Typography>
      <div className={styles.wrap}>
        <AddEnvVariables
          {...{
            control,
            name: "backend",
            error: errors.backend,
          }}
        />
      </div>
      <div></div>
      <Button
        variant="outlined"
        sx={{
          maxWidth: "20px",
          justifySelf: "center",
          marginTop: "15px",
        }}
        type="submit"
      >
        <SaveIcon />
        Save
      </Button>
    </form>
  );
}
