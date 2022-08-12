/**
 * Free Cluster
 */

import React from "react";
import { Link } from "@mui/material";
import MailOutlineIcon from "@mui/icons-material/MailOutline";

import { ClusterProvider, createCluster } from "@/api/cluster";

import styles from "./index.module.scss";
import ApplyFreeCluster from "../ApplyFreeCluster";

interface Props {
  modalDisplay: boolean;
  successCb?: () => void;
  isAvailable: boolean; // If the free cluster has expired, then the user can not create again.
}

export const FreeClusterPanel = ({
  successCb,
  isAvailable,
}: Props): React.ReactElement => {
  function handleConfirm() {
    createCluster({
      kubeconfig: "",
      name: "",
      provider: ClusterProvider.Free,
    }).then(() => {
      successCb && successCb();
    });
  }

  const noticeIcon = isAvailable
    ? "/img/cluster/NoticeIcon.svg"
    : "/img/cluster/free-cluster-expired.svg";
  const noticeText = isAvailable
    ? "This organization is eligible for a 14 day free trial ForkMain Cluster."
    : "14 days free trial of ForkMain Cluster has expired.";

  return (
    <div className={styles.content}>
      {/* <div className={styles.notice}>
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
      } */}
      <ApplyFreeCluster
        {...{
          showType: "Draw",
          DrawSuccessCb: successCb,
        }}
      />
      <Link
        href="https://heighliner.dev/contact-us"
        underline="hover"
        target="_blank"
        sx={{
          color: "gray",
          fontSize: 14,
          display: "flex",
          justifyContent: "flex-end",
          gap: "5px",
          marginTop: "30px",
          marginRight: "40px",
        }}
      >
        Have any question? Contact us!
        <MailOutlineIcon fontSize="small" />
      </Link>
    </div>
  );
};
