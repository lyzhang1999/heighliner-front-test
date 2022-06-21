import React, {useState, useEffect} from 'react';
import {Button, Dialog, DialogActions, DialogContent, DialogContentText, Popover} from '@mui/material';
import '@/utils/axios';
import Layout from "@/components/Layout";
import NewClusterModal from "@/components/NewClusterModal";
import {ClusterItem, deleteCluster} from "@/utils/api/cluster";
import {getClusterList} from "@/utils/api/cluster";
import styles from './index.module.scss';
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {formatDate} from "@/utils/utils";

const Clusters = () => {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [clusterList, setClusterList] = useState<ClusterItem[]>([]);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const [deleteItemID, setDeleteItemID] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  function successCb() {
    getCluster();
  }

  useEffect(() => {
    getCluster()
  }, [])

  function getCluster() {
    getClusterList().then(res => {
      setClusterList(res.data);
    })
  }

  function deleteItem() {
    deleteCluster(deleteItemID).then(res => {
      getCluster();
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
    <Layout pageHeader="CLUSTERS"
            titleContent={(
              <Button
                variant="contained"
                onClick={() => setModalDisplay(!modalDisplay)}
              >
                Create a Cluster
              </Button>
            )}
    >
      <Dialog onClose={closeDialog} open={dialogVisible}>
        {/*<DialogTitle>Delete Git-provider</DialogTitle>*/}
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
          <span>
              Delete
            </span>
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
                  <img src="/img/cluster/cluster.webp" alt="github"/>
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
// http://localhost/xxx/clusters
