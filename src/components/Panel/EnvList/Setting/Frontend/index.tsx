import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { Button, IconButton, Typography } from "@mui/material";
import SaveIcon from "@mui/icons-material/Save";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

import { CommonProps } from "@/utils/commonType";
import { getQuery, Message } from "@/utils/utils";
import useEnvSetting from "@/hooks/envSetting";

import styles from "./index.module.scss";
import AddEnvVariables from "../../AddEnvVariables";
import { SubmitHandler, useForm } from "react-hook-form";
import {
  EnvVariables,
  ServiceType,
  updateEnvSetting,
  UpdateEnvSettingReq,
} from "@/api/application";
import { schema } from "../../AddEnvVariables";

interface Props extends CommonProps {}

interface FieldsValue {
  frontend: EnvVariables;
}

export default function Frontend(props: Props) {
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
      frontend: [],
    },
    resolver: yupResolver(
      yup.object().shape({
        frontend: schema,
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
      const frontendService = services.find(
        (service) => service.type === ServiceType.frontend
      );
      setName(frontendService?.name ?? "");

      if (
        frontendService &&
        frontendService.setting &&
        frontendService.setting.env
      ) {
        const envVariables = frontendService.setting.env;
        console.log(frontendService.setting.env);
        setEnvVariables(envVariables);
        setValue("frontend", envVariables);
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
    //     const frontendService = services.find(
    //       (service) => service.type === ServiceType.frontend
    //     );
    //     if (
    //       frontendService &&
    //       frontendService.setting &&
    //       frontendService.setting.env
    //     ) {
    //       const envVariables = frontendService.setting.env;
    //       console.log(frontendService.setting.env);
    //       setEnvVariables(envVariables);
    //       setValue("frontend", envVariables);
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
            env: data.frontend,
            name: name,
          },
        ],
      },
    };
    updateEnvSetting(req).then(() => {
      Message.success("Update Frontend's settings successfully.");
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
            name: "frontend",
            error: errors.frontend,
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
