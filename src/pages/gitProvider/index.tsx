import React, {useState, useEffect} from "react";
import {
  Button,
  Popover,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Table,
  TableBody,
  TableCell,
  TableRow,
  TableHead,
} from "@mui/material";
import "@/utils/axios";

import Layout from "@/components/Layout";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import {formatDate} from "@/utils/utils";
import AddGitProvider, {AddGitProviderSuccessCb} from "@/components/AddGitProvider";

import styles from "./index.module.scss";
import popStyles from '@/components/PopSelect/index.module.scss'
import {isEmpty} from "lodash-es";
import useGitProviders from "@/hooks/gitProviders";
import {deleteGitProvider} from "@/api/gitProviders";
import clsx from "clsx";

const Clusters = () => {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [gitProviders, getGitProviders] = useGitProviders();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [deleteItemID, setDeleteItemID] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const successCb: AddGitProviderSuccessCb = () => {
    getGitProviders();
  }

  useEffect(() => {
    getGitProviders();
  }, []);

  function deleteProvider() {
    deleteGitProvider(deleteItemID).then((res) => {
      getGitProviders();
      setDeleteItemID(0);
      setDialogVisible(false);
      setAnchorEl(null);
    });
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
    <Layout
      pageHeader="Git Provider"
      rightBtnDesc="add provider"
      rightBtnCb={() => setModalDisplay(!modalDisplay)}
    >
      <div className={styles.wrapper}>
        {!isEmpty(gitProviders) && (
          <Table className="transparentHeader">
            <TableHead>
              <TableRow>
                <TableCell>GIT ORGANIZATION</TableCell>
                <TableCell align="right">CREAT TIME</TableCell>
                <TableCell align="right">STATUS</TableCell>
                <TableCell align="right">CREATE BY</TableCell>
                <TableCell align="right"></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gitProviders.map((item) => (
                <TableRow
                  key={item.git_provider_id}
                  sx={{"&:last-child td, &:last-child th": {border: 0}}}
                >
                  <TableCell component="th" scope="item">
                    <div className={styles.orgWrapper}>
                      <img
                        src="/img/gitprovider/github.webp"
                        alt="github"
                        className={styles.githubIcon}
                      />
                      <span className={styles.orgName}>
                        {item.git_org_name}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <div className={styles.time}>{formatDate(item.created_at * 1000)}</div>
                  </TableCell>
                  <TableCell align="right">
                    <div className={styles.time}>{item.status}</div>
                  </TableCell>
                  <TableCell align="right">
                    <div>{item.created_by_name}</div>
                  </TableCell>
                  <TableCell align="right">
                    <div className={styles.moreIcon}>
                        <MoreVertIcon
                          sx={{cursor: "pointer"}}
                          onClick={(e) => handleClick(e, item.git_provider_id)}
                        />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      <Dialog onClose={closeDialog} open={dialogVisible}>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to delete the Git-Provider?
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{padding: '16px 24px'}}
        >
          <Button onClick={closeDialog}
                  variant="outlined"
          >Cancel</Button>
          <Button onClick={deleteProvider}
                  color="error"
                  variant="outlined"
          >Confirm</Button>
        </DialogActions>
      </Dialog>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <div className={popStyles.selectWrapper} onClick={openDeleteDialog}>
          <span className={clsx(popStyles.selectItem, popStyles.redItem)}>Delete</span>
        </div>
      </Popover>
      <AddGitProvider
        {...{
          setModalDisplay,
          modalDisplay,
          successCb,
        }}
      />
    </Layout>
  );
};
export default Clusters;
