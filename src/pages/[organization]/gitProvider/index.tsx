import React, {useState, useEffect} from 'react';
import {
  Button,
  Popover,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material';
import '@/utils/axios';

import Layout from "@/components/Layout";
import NewGitHubToken from "@/components/Application/VersionControlInfo/NewGitHubToken";
import DeleteIcon from '@mui/icons-material/Delete';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import styles from './index.module.scss';
import {getProviderList, deleteProviderList, GitProviderType} from "@/utils/api/gitProvider";
import {formatDate} from "@/utils/utils";

const Clusters = () => {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [prividerList, setProviderList] = useState<GitProviderType[]>([]);
  const [dialogVisible, setDialogVisible] = useState<boolean>(false)
  const [deleteItemID, setDeleteItemID] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);


  function successCb() {
    getProvider();
  }

  useEffect(() => {
    getProvider()
  }, [])

  function getProvider() {
    getProviderList().then(res => {
      setProviderList(res);
    })
  }

  function deleteProvider() {
    deleteProviderList(deleteItemID).then(res => {
      getProvider();
      setDeleteItemID(0);
      setDialogVisible(false);
      setAnchorEl(null);
    })
  }


  const handleClick = (event: React.MouseEvent<HTMLButtonElement>, id: number) => {
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

  return (
    <Layout pageHeader="GIT PROVIDER"
            titleContent={(
              <Button
                variant="contained"
                onClick={() => setModalDisplay(!modalDisplay)}
              >
                Add Provider
              </Button>
            )}
    >
      <div className={styles.wrapper}>
        <Dialog onClose={closeDialog} open={dialogVisible}>
          {/*<DialogTitle>Delete Git-provider</DialogTitle>*/}
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure to delete the Git-Provider?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={closeDialog}>Cancel</Button>
            <Button onClick={deleteProvider}>
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
        {
          prividerList.map(item => {
            return (
              <div className={styles.card} key={item.git_org_name}>
                <div className={styles.moreIcon} onClick={(e) => handleClick(e, item.id)}>
                  <MoreVertIcon/>
                </div>
                <div className={styles.logo}>
                  <img src="/img/gitprovider/github.webp" alt="github"/>
                </div>
                <div className={styles.content}>
                  <div className={styles.organiztion}>Organization: {item.git_org_name}</div>
                  <div className={styles.creatTime}>CreateTime: {formatDate(item.created_at)}</div>
                </div>
              </div>
            )
          })
        }
      </div>
      <NewGitHubToken
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