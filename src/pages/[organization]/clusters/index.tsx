import React, { useState, useEffect } from 'react';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, Popover,
  Table, TableBody, TableCell, TableRow, TableHead,
} from '@mui/material';
import {isEmpty} from "lodash-es";

import Layout from "@/components/Layout";
import NewClusterModal from "@/components/NewClusterModal";
import {deleteCluster} from "@/utils/api/cluster";
import styles from './index.module.scss';

import { useClusterList } from '@/hooks/cluster';

import { ClusterItemComp } from './ClusterItem';

const Clusters = () => {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const [deleteItemID, setDeleteItemID] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLDivElement | null>(null);
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

  const handleClick = (id: number) => (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget);
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

  if (isEmpty(clusterList)) {
    return (
      <Layout
        pageHeader="Clusters"
        rightBtnDesc="Add Cluster"
        rightBtnCb={() => setModalDisplay(!modalDisplay)}
      >
        <div className={styles.emptyContent}>
          <p>There are no Kubernetes cluster found.</p>
          <p>You can click right top button to add one.</p>
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

  return (
    <Layout
      pageHeader="Clusters"
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
          <span>Delete</span>
        </div>
      </Popover>
      <div className={styles.wrapper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell width={200} align='right'>CLUSTER</TableCell>
              <TableCell width={330} style={{ paddingLeft: 120 }} align="left">REGION</TableCell>
              <TableCell align="left">CREATED BY</TableCell>
              <TableCell align="left">VERSION</TableCell>
              <TableCell align="left"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              clusterList.map(item => (
                <ClusterItemComp
                  {...{ item, handleClick }}
                />
              ))
            }
          </TableBody>
        </Table>
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
