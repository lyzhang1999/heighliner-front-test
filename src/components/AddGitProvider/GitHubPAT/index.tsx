import {Button, TextField} from "@mui/material";
import React, {Dispatch, SetStateAction, useEffect, useState} from "react";

import {GetGitProviderUrl} from "@/utils/config";
import {Message} from "@/utils/utils";
import {
  createGitProvider,
  GitProvider,
  GitProviderType,
} from "@/utils/api/gitProviders";

import styles from "./index.module.scss";
import { trim } from "lodash-es";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: Dispatch<SetStateAction<boolean>>;
  successCb?: Function;
}

export default function GitHubPAT(props: Props): React.ReactElement {
  const [gitProviderOrgName, setGitProviderOrgName] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const handleConfirm = () => {
    if (!trim(gitProviderOrgName)) {
      Message.error("Please input GitHub organization name");
      return;
    }
    if (!trim(token)) {
      Message.error("Please input GitHub personal access token");
      return;
    }

    createGitProvider({
      git_org_name: trim(gitProviderOrgName),
      provider: GitProvider.GitHub,
      type: GitProviderType.PAT,
      personal_access_token: trim(token),
    }).then((res) => {
      Message.success("Add Git provider personal access token successfully");
      props.setModalDisplay(false);
      props.successCb && props.successCb(res);
    });
  };

  const changeGitProviderOrgNameHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGitProviderOrgName(trim(event.target.value));
  };

  const changeTokenHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(trim(event.target.value));
  };

  useEffect(() => {
    setGitProviderOrgName("");
    setToken("");
  }, [props.modalDisplay]);

  return (
    <div className={styles.content}>
      <div className={styles.formWrapper}>
        <div className={styles.label}>Name*</div>
        <TextField
          fullWidth
          value={gitProviderOrgName}
          onChange={changeGitProviderOrgNameHandler}
          size="small"
          placeholder="GIt provider organization name"
        />
      </div>
      <div className={styles.formWrapper}>
        <div className={styles.label}>Access Token*</div>
        <TextField
          fullWidth
          value={token}
          size="small"
          onChange={changeTokenHandler}
          placeholder="GIt provider personal access Token"
        />
      </div>
      <div className={styles.help}>
        <img src="/img/gitprovider/InfoOutlined.webp" alt=""/>
        <span className={styles.desc}>How to get access token?</span>
        <span
          className={styles.link}
          onClick={() => window.open(GetGitProviderUrl)}
        >
          click me
        </span>
      </div>
      <div className={styles.bottom}>
        <Button
          // style={{ marginRight: "87px" }}
          onClick={handleConfirm}
          variant="contained"
          className={styles.bottom}
        >
          create
        </Button>
      </div>
    </div>
  );
}
