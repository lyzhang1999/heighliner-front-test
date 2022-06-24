/**
 * Free Cluster
 */

import React, { useState, useEffect } from "react";
import {
  TextField,
} from '@mui/material';
import {trim} from "lodash-es";

import {Message} from "@/utils/utils";
import {createCluster} from "@/utils/api/cluster";
import Btn from "@/components/Btn";

import styles from './index.module.scss';

interface Props {
  modalDisplay: boolean,
  successCb?: () => void,
  isAvailable: boolean, // If the free cluster has expired, then the user can not create again.
}

export const FreeClusterPanel = ({
  modalDisplay,
  successCb,
  isAvailable,
}: Props): React.ReactElement => {
  const [name, setName] = useState<string>('')

  useEffect(() => {
    setName('');
  }, [modalDisplay])

  const handleChangeName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value)
  }

  function handleConfirm() {
    if (!trim(name)) {
      Message.error("Please input a cluster name");
      return;
    }
    createCluster({
      "kubeconfig": '',
      "name": trim(name),
      "provider": "freeCluster",
    }).then(() => {
      successCb && successCb();
    })
  }

  const noticeIcon = isAvailable ? "/img/cluster/NoticeIcon.svg" : "/img/cluster/free-cluster-expired.svg"
  const noticeText = isAvailable ? "This organization is eligible for a 14 day free trial Heighliner Cluster."
    : "14 days free trial of Heighliner Cluster has expired."

  return (
    <div className={styles.content}>
      <div className={styles.notice}>
        <img src={noticeIcon} alt="Notice" />
        <span>{noticeText}</span>
      </div>
      {
        isAvailable && (
          <div>
            <div className={styles.formWrapper}>
              <div className={styles.label}>
                Name *
              </div>
              <TextField
                fullWidth
                value={name}
                onChange={handleChangeName}
                size='small'
                placeholder="Please input a cluster name"
              />
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
    </div>
  )
}
