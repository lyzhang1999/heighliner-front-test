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
import NewGitProvider from '@/components/Application/NewGitProvider';
import MoreVertIcon from '@mui/icons-material/MoreVert';

import styles from './index.module.scss';
import {deleteProviderList, getGitProviderList, GitProviderType} from "@/utils/api/gitProvider";
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
    getGitProviderList().then(res => {
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
    <Layout pageHeader="GIT PROVIDER"
            rightBtnDesc="ADD PROVIDER"
            rightBtnCb={() => setModalDisplay(!modalDisplay)}
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
                <div className={styles.moreIcon}
                     onClick={(e) => handleClick(e, item.id)}>
                  <MoreVertIcon/>
                </div>
                <div className={styles.logo}>
                  <img src="/img/gitprovider/github.webp" alt="github"/>
                </div>
                <div className={styles.content}>
                  <div className={styles.organiztion}>GitOrganization: {item.git_org_name}</div>
                  <div className={styles.creatTime}>CreateTime: {formatDate(item.created_at * 1000)}</div>
                </div>
              </div>
            )
          })
        }
      </div>
      <NewGitProvider
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
