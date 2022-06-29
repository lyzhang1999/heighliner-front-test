/**
 * Free Cluster
 */

import React from "react";

import {createCluster} from "@/utils/api/cluster";

import styles from './index.module.scss';
import { Button } from "@mui/material";

interface Props {
  modalDisplay: boolean,
  successCb?: () => void,
  isAvailable: boolean, // If the free cluster has expired, then the user can not create again.
}

export const FreeClusterPanel = ({
  successCb,
  isAvailable,
}: Props): React.ReactElement => {
  function handleConfirm() {
    createCluster({
      "kubeconfig": '',
      "name": '',
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
            <div className={styles.bottom}>
              <Button style={{marginLeft: '37px'}}
                  onClick={handleConfirm}
                  variant="contained"
              >
                add
              </Button>
            </div>
          </div>
        )
      }
    </div>
  )
}
