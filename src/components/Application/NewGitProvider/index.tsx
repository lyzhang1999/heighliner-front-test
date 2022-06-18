import { Box, Button, TextField, Drawer } from "@mui/material";
import React, { useEffect, useState } from "react";
import styles from "./index.module.scss";
import "highlight.js/styles/a11y-dark.css";

import { createProviderList } from "@/utils/api/gitProvider";
import {Message} from '@/utils/utils';

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (dispaly: any) => void;
  successCb?: () => void;
}

const buttonStyles = {
  marginRight: "10px",
};

export default function NewGitProvider({
  modalDisplay,
  setModalDisplay,
  successCb,
}: Props) {
  const [gitProviderOrgName, setGitProviderOrgName] = useState<string>("");
  const changeGitProviderOrgNameHandler = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setGitProviderOrgName(event.target.value);
  };

  const [token, setToken] = useState<string>("");
  const changeTokenHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    setToken(event.target.value);
  };

  useEffect(() => {
    setGitProviderOrgName("");
    setToken("");
  }, [modalDisplay]);

  function handleConfirm() {
    if (!gitProviderOrgName) {
      Message.error('Please input GitHub organization name');
      return;
    }
    if (!token) {
      Message.error('Please input GitHub personal access token');
      return;
    }

    createProviderList({
      git_org_name: gitProviderOrgName,
      provider: "GITHUB",
      token: token,
    }).then((res) => {
      Message.success('Add Git provider personal access token successfully');
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
                "& .MuiTextField-root": { marginTop: "20px", width: "100%" },
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  label="Git Provider Organization Name"
                  multiline
                  // maxRows={4}
                  value={gitProviderOrgName}
                  onChange={changeGitProviderOrgNameHandler}
                />
              </div>
              <div>
                <TextField
                  label="Git Provider Personal Access Token"
                  multiline
                  // rows={8}
                  value={token}
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
