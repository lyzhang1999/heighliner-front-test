import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, Popover,
} from '@mui/material';

import Layout from "@/components/Layout";
import NewClusterModal from "@/components/NewClusterModal";
import {deleteCluster} from "@/utils/api/cluster";
import styles from './index.module.scss';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {formatDate} from "@/utils/utils";

import { useClusterList } from '@/hooks/cluster';

const Clusters = () => {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const [deleteItemID, setDeleteItemID] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);
  const [clusterList, getClusters] = useClusterList();

  function successCb() {
    getClusters();
    setModalDisplay(false) // close cluster creation modal.
  }

  function deleteItem() {
    deleteCluster(deleteItemID).then(res => {
      getClusters();
      setDeleteItemID(0);
      setDialogVisible(false);
      setAnchorEl(null);
    })
  }

  const handleClick = (e: any, id: number) => {
    setAnchorEl(e?.currentTarget);
    setDeleteItemID(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const closeDialog = () => {
    setDialogVisible(false);
    setAnchorEl(null);
  };

  function openDeleteDialog() {
    setDialogVisible(true);
  }

  return (
    <Layout pageHeader="Clusters"
            rightBtnDesc="Add Cluster"
            rightBtnCb={() => setModalDisplay(!modalDisplay)}
    >
      <Dialog onClose={closeDialog} open={dialogVisible}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete the Cluster?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={deleteItem}>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={styles.deleteIcon} onClick={openDeleteDialog}>
          {/*<DeleteIcon/>*/}
          <span>Delete</span>
        </div>
      </Popover>

      <div className={styles.wrapper}>
        {
          clusterList.map(item => {
            return (
              <div className={styles.card} key={item.name}>
                <div className={styles.moreIcon}
                     onClick={(e) => handleClick(e, item.id)}>
                  <MoreVertIcon/>
                </div>
                <div className={styles.logo}>
                  <img src="/img/cluster/k8s-logo.webp" alt="github"/>
                </div>
                <div className={styles.content}>
                  <div className={styles.organiztion}>Cluster: {item.name}</div>
                  <div>Status: {item.status}</div>
                  <div className={styles.creatTime}>CreateTime: {formatDate(item.created_at * 1000)}</div>
                </div>
              </div>
            )
          })
        }
      </div>
      <NewClusterModal
        {...{
          setModalDisplay,
          modalDisplay,
          successCb,
        }}
      />
    </Layout>
  )
}
export default Clusters;
