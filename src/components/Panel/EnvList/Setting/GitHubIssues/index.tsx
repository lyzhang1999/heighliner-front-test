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
import AddGitHubIssues, {
  schema,
  FieldsMap as AddGitHubIssuesFieldsMap,
} from "../../AddGitHubIssues";

interface Props extends CommonProps {}

const FieldsMap = {
  ISSUES: "Issue",
} as const;

interface FieldsValue {
  [FieldsMap.ISSUES]: Array<{
    [AddGitHubIssuesFieldsMap.URL]: string;
  }>;
}

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
      [FieldsMap.ISSUES]: [],
    },
    resolver: yupResolver(
      yup.object().shape({
        [FieldsMap.ISSUES]: schema,
      })
    ),
  });

  useEffect(() => {
    // if (envGitHubIssues && envGitHubIssues.length === 1) {
    //   setValue(FieldsMap.ISSUES, envGitHubIssues[0].url);
    // }
    if (envGitHubIssues && envGitHubIssues.length >= 1) {
      const issues = envGitHubIssues.map((issue) => ({
        [AddGitHubIssuesFieldsMap.URL]: issue.url,
      }));
      setValue(FieldsMap.ISSUES, issues);
    }
  }, [envGitHubIssues]);

  const submit: SubmitHandler<FieldsValue> = (data) => {
    if (data[FieldsMap.ISSUES] && data[FieldsMap.ISSUES].length >= 1) {
      // Parse issue URLs.
      const issue_urls: Array<string> = [];
      data[FieldsMap.ISSUES].map((issue) =>
        issue_urls.push(issue[AddGitHubIssuesFieldsMap.URL])
      );

      updateEnvGitHubIssue({
        app_id,
        env_id,
        body: {
          issue_urls,
        },
      }).then(() => {
        Message.success("Update issues successfully.");
        flushEnvGitHubIssues();
      });
    } else {
      deleteEnvGitHubIssue({
        app_id,
        env_id,
      }).then((res) => {
        Message.success("Clear all issue successfully.");
        flushEnvGitHubIssues();
      });
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
              Issues:
            </Typography>
            <AddGitHubIssues
              {...{
                control,
                name: FieldsMap.ISSUES,
                error: errors[FieldsMap.ISSUES],
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
