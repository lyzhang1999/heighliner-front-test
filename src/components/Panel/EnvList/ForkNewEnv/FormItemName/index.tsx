import React from "react";
import clsx from "clsx";
import * as yup from "yup";
import { Control, Controller, FieldError } from "react-hook-form";
import { FormControl, TextField } from "@mui/material";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";
import { SharedFormFieldName, SharedFormFieldValues } from "../constants";

interface Props extends CommonProps {
  control: Control<
    Pick<SharedFormFieldValues, typeof SharedFormFieldName["NAME"]>
  >;
  error: FieldError | undefined;
}

export const schema = yup
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
  );

export default function FormItemName({
  control,
  error,
}: Props): React.ReactElement {
  return (
    <Controller
      name={SharedFormFieldName.NAME}
      control={control}
      render={({ field }) => (
        <FormControl>
          <TextField
            value={field.value}
            onChange={field.onChange}
            error={error !== undefined}
            helperText={error !== undefined && error?.message}
            size="small"
            placeholder="The new forked environment(branch) name"
            autoFocus
          />
        </FormControl>
      )}
    />
  );
}
