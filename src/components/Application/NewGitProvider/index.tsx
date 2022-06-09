import { Box, Button, TextField, Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";

import styles from "./index.module.scss";
import "highlight.js/styles/a11y-dark.css";

import { NoticeRef } from "@/components/Notice";
import { addGitHubToken } from "@/utils/api/githubToken";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (dispaly: any) => void;
  successCb?: () => {};
}

const buttonStyles = {
  marginRight: "10px",
};

export default function NewGitProvider({
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
    if (!gitHubOrgName) {
      NoticeRef.current?.open({
        message: "Please input GitHub organization name",
        type: "error",
      });
      return;
    }
    if (!token) {
      NoticeRef.current?.open({
        message: "Please input GitHub personal access token",
        type: "error",
      });
      return;
    }

    // addGitHubToken({
    //   git_org_name: gitHubOrgName,
    //   provider: "github",
    //   token: token,
    // }).then((res) => {
    //   NoticeRef.current?.open({
    //     message: "Add GitHub personal access token successfully!",
    //     type: "success",
    //   });
    //   setModalDisplay(false);
    //   successCb && successCb();
    // });
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
                "& .MuiTextField-root": { marginTop: "20px", width: "100%" },
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
                  color="success"
                />
              </div>
              <div>
                <TextField
                  label="GitHub Personal Access Token"
                  multiline
                  rows={8}
                  value={token}
                  color="success"
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
              // sx={buttonStyles}
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
