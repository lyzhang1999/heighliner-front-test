import { TextField } from "@mui/material";
import React, { Dispatch, SetStateAction, useEffect } from "react";

import { GetGitProviderUrl } from "@/utils/config";

import styles from "./index.module.scss";

interface Props {
  token: string;
  setToken: Dispatch<SetStateAction<string>>;
  gitProviderOrgName: string;
  setGitProviderOrgName: Dispatch<SetStateAction<string>>;
  modalDisplay: boolean;
  setModalDisplay: Dispatch<SetStateAction<boolean>>;
  successCb?: Function;
}

export default function GitHubPAT(props: Props): React.ReactElement {
  const changeGitProviderOrgNameHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    props.setGitProviderOrgName(event.target.value);
  };

  const changeTokenHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    props.setToken(event.target.value);
  };

  useEffect(() => {
    props.setGitProviderOrgName("");
    props.setToken("");
  }, [props.modalDisplay]);

  return (
    <div className={styles.content}>
      <div className={styles.formWrapper}>
        <div className={styles.label}>Name*</div>
        <TextField
          fullWidth
          value={props.gitProviderOrgName}
          onChange={changeGitProviderOrgNameHandler}
          size="small"
          placeholder="GIt provider organization name"
        />
      </div>
      <div className={styles.formWrapper}>
        <div className={styles.label}>Access Token*</div>
        <TextField
          fullWidth
          value={props.token}
          size="small"
          onChange={changeTokenHandler}
          placeholder="GIt provider personal access Token"
        />
      </div>
      <div className={styles.help}>
        <img src="/img/gitprovider/InfoOutlined.webp" alt="" />
        <span className={styles.desc}>How to get access token?</span>
        <span
          className={styles.link}
          onClick={() => window.open(GetGitProviderUrl)}
        >
          click me
        </span>
      </div>
    </div>
  );
}
