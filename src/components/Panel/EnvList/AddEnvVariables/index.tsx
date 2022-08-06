import React from "react";
import clsx from "clsx";
import {
  Control,
  Controller,
  FieldError,
  FieldValue,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import { TextField } from "@mui/material";
import Image from "next/image";
import * as yup from "yup";
import {EnvType, FrameItemType, FrameworkType} from "@/components/Application/Create/util";
import ImportEnvFileByJson from "@/components/ImportEnvFileByJson";
import ImportEnvByJson from "@/components/ImportEnvByJson";
import { CommonProps } from "@/utils/commonType";
import { EnvVariableMap, EnvVariables } from "@/api/application";

import styles from "./index.module.scss";

export const schema = yup.array().of(
  yup.object().shape({
    [EnvVariableMap.name]: yup.string().required("Please enter key."),
    [EnvVariableMap.value]: yup.string().required("Please enter value."),
  })
);

interface Props extends CommonProps {
  control: Control<FieldValue<FieldValues>, any>;
  name: string;
  error:
    | Array<{
        [EnvVariableMap.name]?: FieldError;
        [EnvVariableMap.value]?: FieldError;
      }>
    | undefined;
  // emitAppend: (envVariables: EnvVariables) => void;
}

export default function AddEnvVariables(props: Props): React.ReactElement {
  const {
    fields: variables,
    append: appender,
    remove: remover,
  } = useFieldArray({
    control: props.control,
    name: props.name,
  });
  function addEnvByJson(obj: EnvType[]){
    appender(obj);
  }
  return (
    <div className={styles.wrapper}>
      {variables.map((variable, index) => (
        <div key={variable.id} className={styles.wrap}>
          <Controller
            name={`${props.name}.${index}.${EnvVariableMap.name}`}
            control={props.control}
            render={({ field }) => (
              <TextField
                size="small"
                sx={{ ...IconFocusStyle, width: "150px" }}
                value={field.value}
                onChange={field.onChange}
                error={
                  props.error &&
                  props.error[index] &&
                  props.error[index][EnvVariableMap.name] !== undefined
                }
                helperText={
                  props.error &&
                  props.error[index] &&
                  props.error[index][EnvVariableMap.name]?.message
                }
              />
            )}
          />
          <span className={styles.equal}>=</span>
          <Controller
            name={`${props.name}.${index}.${EnvVariableMap.value}`}
            control={props.control}
            render={({ field }) => (
              <TextField
                size="small"
                sx={{ ...IconFocusStyle, width: "150px" }}
                value={field.value}
                onChange={field.onChange}
                error={
                  props.error &&
                  props.error[index] &&
                  props.error[index][EnvVariableMap.value] !== undefined
                }
                helperText={
                  props.error &&
                  props.error[index] &&
                  props.error[index][EnvVariableMap.value]?.message
                }
              />
            )}
          />
          <div
            style={{
              position: "relative",
              width: "20px",
              height: "20px",
            }}
          >
            <Image
              src="/img/application/delete.svg"
              alt=""
              onClick={() => remover(index)}
              layout="fill"
              objectFit="contain"
            />
          </div>
        </div>
      ))}
      <div
        className={styles.add}
        onClick={() =>
          appender({ [EnvVariableMap.name]: "", [EnvVariableMap.value]: "" })
        }
      >
        ADD ONE
      </div>
      <ImportEnvByJson addEnvByJson={addEnvByJson} />
      <ImportEnvFileByJson addEnvByJson={addEnvByJson}/>
    </div>
  );
}

const widthSx = { width: "250px" };

export const IconFocusStyle = {
  background: "#fff",
  borderRadius: "4px",
  ...widthSx,
};
