import React, { useState, useEffect } from "react";
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
import { formatDate } from "@/utils/utils";
import AddGitProvider from "@/components/AddGitProvider";

import styles from "./index.module.scss";
import { isEmpty } from "lodash-es";
import useGitProviders from "@/hooks/gitProviders";
import { deleteGitProvider } from "@/utils/api/gitProviders";

const Clusters = () => {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  // const [prividerList, setProviderList] = useState<GitProviderType[]>([]);
  const [gitProviders, getGitProviders] = useGitProviders();
  const [dialogVisible, setDialogVisible] = useState<boolean>(false);
  const [deleteItemID, setDeleteItemID] = useState<number>(0);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  function successCb() {
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
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>GitOrganization</TableCell>
                <TableCell align="right">CreateTime</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {gitProviders.map((item) => (
                <TableRow
                  key={item.id}
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
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
                    {formatDate(item.created_at * 1000)}
                  </TableCell>
                  <TableCell align="right">
                    <div className={styles.moreIcon}>
                      <div
                        className={styles.icon}
                        onClick={(e) => handleClick(e, item.id)}
                      >
                        <MoreVertIcon />
                      </div>
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
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button onClick={deleteProvider}>Confirm</Button>
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
        <div className={styles.deleteIcon} onClick={openDeleteDialog}>
          <span>Delete</span>
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
