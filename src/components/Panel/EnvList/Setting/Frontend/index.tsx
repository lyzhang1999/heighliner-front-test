import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { Button, Typography } from "@mui/material";
import UpgradeOutlinedIcon from "@mui/icons-material/UpgradeOutlined";
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
      <Button
        variant="outlined"
        sx={{
          width: "100%",
          marginTop: "30px",
          marginBottom: "10px",
          gridColumn: "span 2",
          height: "45px",
        }}
        type="submit"
      >
        <UpgradeOutlinedIcon />
        Update
      </Button>
    </form>
  );
}
