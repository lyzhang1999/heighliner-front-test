import React, { useContext, useEffect, useState } from "react";
import clsx from "clsx";
import { Button, Typography } from "@mui/material";
import UpgradeOutlinedIcon from "@mui/icons-material/UpgradeOutlined";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { SubmitHandler, useForm } from "react-hook-form";

import { CommonProps } from "@/utils/commonType";
import { getQuery, Message } from "@/utils/utils";
import { EnvVariables, ServiceType } from "@/api/application";
import {
  updateEnvSetting,
  UpdateEnvSettingReq,
} from "@/api/application/env-settings";

import styles from "./index.module.scss";
import AddEnvVariables from "../../AddEnvVariables";
import { schema } from "../../AddEnvVariables";

interface Props extends CommonProps {
  origin: UpdateEnvSettingReq["body"]["service"][number];
}

interface FieldsValue {
  service: EnvVariables;
}

export default function SettingMicroService({ origin }: Props) {
  const app_id = +getQuery("app_id");
  const env_id = +getQuery("env_id");

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FieldsValue>({
    defaultValues: {
      service: origin.env,
    },
    resolver: yupResolver(
      yup.object().shape({
        frontend: schema,
      })
    ),
  });

  const submitHandler: SubmitHandler<FieldsValue> = (data) => {
    const req: UpdateEnvSettingReq = {
      app_id: app_id,
      env_id: env_id,
      body: {
        service: [
          {
            env: data.service,
            name: origin.name,
          },
        ],
      },
    };
    updateEnvSetting(req).then(() => {
      Message.success("Update Service's settings successfully.");
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
            name: "service",
            error: errors.service,
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
