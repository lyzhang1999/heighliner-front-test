import React from "react";
import * as yup from "yup";
import {
  Control,
  Controller,
  FieldError,
  FieldValue,
  FieldValues,
  useFieldArray,
} from "react-hook-form";
import Image from "next/image";
import ContactSupportIcon from "@mui/icons-material/ContactSupport";

import {CommonProps} from "@/utils/commonType";

import styles from "./index.module.scss";
import {TextField, Tooltip} from "@mui/material";

export const FieldsMap = {
  URL: "URL",
} as const;

interface Props extends CommonProps {
  control: Control<FieldValue<FieldValues>>;
  name: string;
  error: Array<{ [FieldsMap.URL]?: FieldError }> | undefined;
}

export const schema = yup.array().of(
  yup.object().shape({
    [FieldsMap.URL]: yup
      .string()
      .trim()
      .required("Please enter a GitHub issue link")
      .matches(/https?:\/\/github.com\/[\w-]+\/[\w-]+\/issues\/[0-9]+/, {
        message: "Please enter validated GitHub issue link.",
      }),
  })
);

export default function AddGitHubIssues(props: Props): React.ReactElement {
  const {
    fields: issues,
    append: appender,
    remove: remover,
  } = useFieldArray({
    control: props.control,
    name: props.name,
  });

  return (
    <div className={styles.wrapper}>
      {issues.map((issue, index) => (
        <div key={issue.id}>
          <Controller
            name={`${props.name}.${index}.${FieldsMap.URL}`}
            control={props.control}
            render={({ field }) => (
              <div className={styles.issueWrap}>
                <TextField
                  size="small"
                  value={field.value}
                  onChange={field.onChange}
                  error={
                    props.error &&
                    props.error[index] &&
                    props.error[index][FieldsMap.URL] !== undefined
                  }
                  helperText={
                    props.error &&
                    props.error[index] &&
                    props.error[index][FieldsMap.URL] &&
                    props.error[index][FieldsMap.URL]?.message
                  }
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
            )}
          />
        </div>
      ))}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "5px",
          alignItems: "center",
        }}
      >
        <div
          className={styles.add}
          onClick={() =>
            appender({
              [FieldsMap.URL]: "",
            })
          }
        >
          ADD ONE
        </div>
        <div
          style={{
            color: "rgba(155, 172, 185, 0.5)",
            cursor: "help",
          }}
        >
          <Tooltip title="The related GitHub issue link with this environment">
            <ContactSupportIcon />
          </Tooltip>
        </div>
      </div>
    </div>
  );
}
