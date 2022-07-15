import React, {useEffect, useState} from 'react';
import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText, Popover,
  Table, TableBody, TableCell, TableRow, TableHead,
} from '@mui/material';
import {find, isEmpty} from "lodash-es";

import Layout from "@/components/Layout";
import NewClusterModal from "@/components/NewClusterModal";
import {ClusterStatus, deleteCluster} from "@/api/cluster";
import {useClusterList} from '@/hooks/cluster';
import {ClusterItemComp} from '@/components/Cluster/ClusterItem';

import styles from './index.module.scss';
import popStyles from "@/components/PopSelect/index.module.scss";
import clsx from "clsx";

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

  useEffect(() => {
    let hasInitializingCluster = find(clusterList, {status: ClusterStatus.Initializing});
    let timer: ReturnType<typeof setTimeout>;
    if (hasInitializingCluster) {
      timer = setTimeout(() => {
        getClusters();
      }, 1000 * 60);
    }
    return () => clearTimeout(timer);
  }, [clusterList])

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
        <DialogActions
          sx={{padding: '16px 24px'}}
        >
          <Button onClick={closeDialog}
                  variant="outlined"
          >Cancel</Button>
          <Button onClick={deleteItem}
                  color="error"
                  variant="outlined"
          >
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
        <div className={popStyles.selectWrapper} onClick={openDeleteDialog}>
          <span className={clsx(popStyles.selectItem, popStyles.redItem)}>Delete</span>
        </div>
      </Popover>
      <div className={styles.wrapper}>
        <Table className="transparentHeader">
          <TableHead>
            <TableRow>
              <TableCell width={200} align='right'>CLUSTER</TableCell>
              <TableCell className={styles.regionColumn} align="right">REGION</TableCell>
              <TableCell align="right">CREATED BY</TableCell>
              <TableCell align="right">VERSION</TableCell>
              <TableCell align="right">CREATE TIME</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {
              clusterList.map((item, index) => (
                <ClusterItemComp
                  key={index}
                  {...{item, handleClick}}
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
