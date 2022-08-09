import React, { useEffect } from "react";
import clsx from "clsx";
import * as yup from "yup";
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import UpgradeOutlinedIcon from "@mui/icons-material/UpgradeOutlined";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import useGitHubIssues from "@/hooks/GitHubIssues";
import { CommonProps } from "@/utils/commonType";
import { getQuery, Message } from "@/utils/utils";

import styles from "./index.module.scss";
import {
  createEnvGitHubIssue,
  deleteEnvGitHubIssue,
  updateEnvGitHubIssue,
} from "@/api/application/GitHubIssues";

interface Props extends CommonProps {}

const FieldsMap = {
  ISSUES: "Issue",
} as const;

interface FieldsValue {
  [FieldsMap.ISSUES]: string;
}

const schema: yup.SchemaOf<FieldsValue> = yup.object().shape({
  [FieldsMap.ISSUES]: yup
    .string()
    .default("")
    .trim()
    .test(
      "Validated GitHub issue link.",
      "Please enter validated GitHub issue link.",
      (value) =>
        value.length <= 0 ||
        /https?:\/\/github.com\/[\w-]+\/[\w-]+\/issues\/[0-9]+/.test(value)
    ),
});

export default function GitHubIssues(props: Props): React.ReactElement {
  const app_id = +getQuery("app_id");
  const env_id = +getQuery("env_id");

  const [envGitHubIssues, flushEnvGitHubIssues] = useGitHubIssues({
    app_id,
    env_id,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    reset,
  } = useForm<FieldsValue>({
    defaultValues: {
      [FieldsMap.ISSUES]: "",
    },
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    if (envGitHubIssues && envGitHubIssues.length === 1) {
      setValue(FieldsMap.ISSUES, envGitHubIssues[0].url);
    }
  }, [envGitHubIssues]);

  const clear = () => {
    reset();
  };

  const submit: SubmitHandler<FieldsValue> = (data) => {
    const newIssueURL = data[FieldsMap.ISSUES];

    if (!envGitHubIssues || envGitHubIssues.length <= 0) {
      if (newIssueURL.length <= 0) {
        Message.warning("Nothing change to issue.");
      } else {
        // Append a new issue
        createEnvGitHubIssue({
          app_id,
          env_id,
          body: {
            issue_url: newIssueURL,
          },
        }).then(() => {
          Message.success("Append a new issue.");
          flushEnvGitHubIssues();
        });
      }
    } else {
      if (newIssueURL === envGitHubIssues[0].url) {
        Message.warning("Nothing change to issue.");
      } else if (newIssueURL.length <= 0) {
        // Delete the current issue.
        deleteEnvGitHubIssue({
          app_id,
          env_id,
          issue_id: envGitHubIssues[0].id,
        }).then(() => {
          Message.success("Clear the issue successfully.");
          flushEnvGitHubIssues();
        });
      } else {
        // Change the issue.
        updateEnvGitHubIssue({
          app_id,
          env_id,
          issue_id: envGitHubIssues[0].id,
          body: {
            issue_url: newIssueURL,
          },
        }).then(() => {
          Message.success("Update issue successfully.");
          flushEnvGitHubIssues();
        });
      }
    }
  };

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(submit)}>
      <Controller
        control={control}
        name={FieldsMap.ISSUES}
        render={({ field }) => (
          <FormControl className={styles.issueWrap}>
            <Typography
              sx={{
                fontFamily: "Roboto",
                fontSize: "15px",
                fontWeight: 500,
                lineHeight: 1.4,
                color: "#303133",
              }}
            >
              Issue:
            </Typography>
            <TextField
              value={field.value}
              onChange={field.onChange}
              error={errors[FieldsMap.ISSUES] !== undefined}
              helperText={
                errors[FieldsMap.ISSUES] && errors[FieldsMap.ISSUES]?.message
              }
              placeholder="The related GitHub issue link with this environment"
              size="small"
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={clear}>
                      <HighlightOffIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "&.Mui-focused .MuiIconButton-root": {
                  background: "black",
                  color: "black",
                },
              }}
            />
          </FormControl>
        )}
      />
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
