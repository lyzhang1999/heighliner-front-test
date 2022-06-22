import {TextField, Drawer} from "@mui/material";
import React, {useEffect, useState} from "react";
import styles from "./index.module.scss";

import {createProviderList} from "@/utils/api/gitProvider";
import {Message} from '@/utils/utils';
import Btn, {BtnType} from "@/components/Btn";
import {GetGitProviderUrl} from "@/utils/config";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: (dispaly: any) => void;
  successCb?: () => void;
}

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
    <div className={styles.drawer}>
      <Drawer anchor="right" open={modalDisplay}
              sx={{"root": {borderTopLeftRadius: '14px', border: "1px solid black"}}}
      >
        <div className={styles.drawerWrap}>
          <div className={styles.header}>
            Append a new github personal acess token
          </div>
          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <div className={styles.label}>
                Name*
              </div>
              <TextField
                fullWidth
                value={gitProviderOrgName}
                onChange={changeGitProviderOrgNameHandler}
                size='small'
                placeholder="GIt provider organization name"
              />
            </div>
            <div className={styles.formWrapper}>
              <div className={styles.label}>
                Access Token*
              </div>
              <TextField
                fullWidth
                value={token}
                size='small'
                onChange={changeTokenHandler}
                placeholder="GIt provider personal access Token"
              />
            </div>
            <div className={styles.help}>
              <img src="/img/gitprovider/InfoOutlined.webp" alt=""/>
              <span className={styles.desc}>
                How to get Kubeconfig?
              </span>
              <span className={styles.link} onClick={() => window.open(GetGitProviderUrl)}>
                click me
              </span>
            </div>
          </div>
          <div className={styles.bottom}>
            <Btn style={{marginRight: '87px'}}
                 onClick={handleConfirm}
            >
              CREATE
            </Btn>
            <Btn type={BtnType.gray}
                 onClick={() => setModalDisplay(false)}
            >
              CREATE
            </Btn>
          </div>
        </div>
      </Drawer>
    </div>
  );
}
