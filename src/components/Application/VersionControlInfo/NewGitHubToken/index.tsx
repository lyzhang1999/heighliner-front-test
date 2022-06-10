import {Box, Button, TextField, Drawer} from "@mui/material";
import React, {useEffect, useState} from "react";

import {NoticeRef} from "@/components/Notice";
import {addGitHubToken} from "@/utils/api/githubToken";
import {trim} from "lodash-es";

import styles from "./index.module.scss";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (dispaly: any) => void;
  successCb?: () => void;
}

const buttonStyles = {
  marginRight: "10px",
};

export default function NewGitHubToken({
  modalDisplay,
  setModalDisplay,
  successCb,
}: Props) {
  const [gitHubOrgName, setGitHubOrgName] = useState<string>("");
  const changeGitHubOrgNameHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGitHubOrgName(event.target.value);
  };

  const [token, setToken] = useState<string>("");
  const changeTokenHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  };

  useEffect(() => {
    setGitHubOrgName("");
    setToken("");
  }, [modalDisplay]);

  function handleConfirm() {
    if (!trim(gitHubOrgName)) {
      NoticeRef.current?.open({
        message: "Please input GitHub organization name",
        type: "error",
      });
      return;
    }
    if (!trim(token)) {
      NoticeRef.current?.open({
        message: "Please input GitHub personal access token",
        type: "error",
      });
      return;
    }

    addGitHubToken({
      git_org_name: trim(gitHubOrgName),
      provider: "github",
      token: trim(token),
    }).then((res) => {
      NoticeRef.current?.open({
        message: "Add GitHub personal access token successfully!",
        type: "success",
      });
      setModalDisplay(false);
      successCb && successCb();
    });
  }

  return (
    <div>
      <Drawer anchor="right" open={modalDisplay}>
        <div className={styles.drawerWrap}>
          <div className={styles.header}>
            Append a new GitHub Personal Access Token
          </div>
          <div className={styles.content}>
            <Box
              component="form"
              sx={{
                width: "100%",
                "& .MuiTextField-root": {marginTop: "20px", width: "100%"},
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  label="GitHub Organization Name"
                  multiline
                  maxRows={4}
                  value={gitHubOrgName}
                  onChange={changeGitHubOrgNameHandler}
                  color="textColor"
                />
              </div>
              <div>
                <TextField
                  label="GitHub Personal Access Token"
                  multiline
                  rows={8}
                  value={token}
                  color="textColor"
                  onChange={changeTokenHandler}
                />
              </div>
            </Box>
          </div>
          <div className={styles.bottom}>
            <Button
              variant="outlined"
              sx={buttonStyles}
              onClick={() => setModalDisplay(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
