/**
 * Kubeconfig panel
 */

import React, { useEffect, useState } from "react";
import {
  TextField,
} from '@mui/material';
import {trim} from "lodash-es";

import Btn from "@/components/Btn";
import {Message} from "@/utils/utils";
import {createCluster} from "@/utils/api/cluster";

import styles from './index.module.scss';

interface Props {
  modalDisplay: boolean,
  successCb?: () => void,
}

export const KubeconfigPanel = ({
  modalDisplay,
  successCb,
}: Props): React.ReactElement => {
  const [configName, setConfigName] = useState<string>('');
  const [configValue, setConfigValue] = useState<string>('');

  const handleConfigName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigName(event.target.value);
  };

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
    }).then(() => {
      successCb && successCb();
    })
  }

  return (
    <div className={styles.content}>
      <div className={styles.formWrapper}>
        <div className={styles.label}>
          Name *
        </div>
        <TextField
          fullWidth
          value={configName}
          onChange={handleConfigName}
          size='small'
          placeholder="Please input a cluster name"
        />
      </div>
      <div className={styles.formWrapper}>
        <div className={styles.label}>
          Kubeconfig *
        </div>
        <TextField
          size='small'
          fullWidth
          multiline
          rows={8}
          value={configValue}
          onChange={handleConfigValue}
          placeholder="Please paste your kubeconfig content"
        />
      </div>
      <div className={styles.help}>
        <img src="/img/gitprovider/InfoOutlined.webp" alt=""/>
        <span className={styles.desc}>
          How to get kubeconfig content?
        </span>
      </div>
      <div className={styles.copyCode}>
        <div className={styles.code}>
          kubectl config view --minify --raw --flatten
        </div>
      </div>
      <div className={styles.bottom}>
        <Btn style={{marginLeft: '37px'}}
            onClick={handleConfirm}
        >
          Add
        </Btn>
      </div>
    </div>
  )
}
