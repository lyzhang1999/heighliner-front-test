import React from "react";
import clsx from "clsx";
import { Control, Controller } from "react-hook-form";
import { FormControl } from "@mui/material";
import * as yup from "yup";

import { CommonProps } from "@/utils/commonType";
import { EnvType } from "@/api/application";

import styles from "./index.module.scss";
import { SharedFormFieldName, SharedFormFieldValues } from "../constants";

interface Props extends CommonProps {
  control: Control<
    Pick<SharedFormFieldValues, typeof SharedFormFieldName["ENV_TYPE"]>
  >;
}

export const schema = yup
  .mixed<EnvType>()
  .oneOf(Object.values(EnvType))
  .default(EnvType.Development)
  .required();

// yup
//   .string()
//   .default(EnvType.Development)
//   .required("Please choose the forked environment type.");
// .oneOf(Object.values(EnvType));

export default function FormItemEnvType({
  control,
}: Props): React.ReactElement {
  return (
    <Controller
      name={SharedFormFieldName.ENV_TYPE}
      control={control}
      render={({ field }) => (
        <FormControl
          sx={{
            flexDirection: "row",
            alignItems: "center",
            gap: "55px",
          }}
        ></FormControl>
      )}
    />
  );
}
