import {
  Box,
  Button,
  TextField,
  Drawer,
} from '@mui/material';
import React, {useEffect, useState} from "react";
import {createCluster} from "@/utils/api/cluster";
import {trim} from "lodash-es";
import styles from '@/components/Application/NewGitProvider/index.module.scss';
import {Message} from "@/utils/utils";
import Btn, {BtnType} from "@/components/Btn";
import {GetGitProviderUrl} from "@/utils/config";

interface Props {
  modalDisplay: boolean
  setModalDisplay: (dispaly: any) => void,
  successCb?: () => void,
}

const buttonStyles = {
  marginRight: "10px",
}

const NewClusterModal = ({modalDisplay, setModalDisplay, successCb}: Props) => {

  const [configName, setConfigName] = useState<string>('');
  const handleConfigName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigName(event.target.value);
  };

  const [configValue, setConfigValue] = useState<string>('');
  const handleConfigValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigValue(event.target.value);
  };

  useEffect(() => {
    setConfigName("");
    setConfigValue("")
  }, [modalDisplay])

  function handleConfirm() {

    if (!trim(configName)) {
      Message.error("Please input cluster name");
      return;
    }
    if (!trim(configValue)) {
      Message.error("Please input kube config");
      return;
    }
    createCluster({
      "kubeconfig": trim(configValue),
      "name": trim(configName),
      "provider": "kubeconfig"
    }).then(res => {
      setModalDisplay(false);
      successCb && successCb();
    })
  }

  return (
    <div>
      <Drawer
        anchor="right"
        open={modalDisplay}
      >
        <div className={styles.drawerWrap}>
          <div className={styles.header}>
            Create a new cluster
          </div>
          <div className={styles.content}>
            <div className={styles.formWrapper}>
              <div className={styles.label}>
                Name*
              </div>
              <TextField
                fullWidth
                value={configName}
                onChange={handleConfigName}
                size='small'
                placeholder="please input cluster name"
              />
            </div>
            <div className={styles.formWrapper}>
              <div className={styles.label}>
                Kube config*
              </div>
              <TextField
                size='small'
                fullWidth
                multiline
                rows={8}
                value={configValue}
                onChange={handleConfigValue}
                placeholder="please input kube config"
              />
            </div>
            <div className={styles.help}>
              <img src="/img/gitprovider/InfoOutlined.webp" alt=""/>
              <span className={styles.desc}>
                How to get Kubeconfig?
              </span>
            </div>
            <div className={styles.copyCode}>
              <div className={styles.code}>
                kubectl config use -- context dev -- cluster
              </div>
              <div className={styles.code}>
                kubectl config view -- minify -- raw --flatten
              </div>
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
              CANEL
            </Btn>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default NewClusterModal;
