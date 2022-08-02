import React, { useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Typography,
} from "@mui/material";

import { CommonProps } from "@/utils/commonType";
import Layout from "@/components/Layout";
import SingleCollapsiblePanel from "@/basicComponents/SingleCollapsiblePanel";
import { getQuery, getUrlEncodeName, Message } from "@/utils/utils";
import { deleteEnv, getProdEnv } from "@/api/application";
import { useGlobalLoading } from "@/hooks/GlobalLoading";

import styles from "./index.module.scss";

interface Props extends CommonProps {}

export default function Settings(props: Props): React.ReactElement {
  const [openDialog, setOpenDialog] = useState(false);
  const [disableDelete, setDisableDelete] = useState(false);
  const router = useRouter();

  const app_id = getQuery("app_id");
  const env_id = getQuery("env_id");

  const { setGlobalLoading } = useGlobalLoading();

  const handleOpenDialog = () => {
    // Unable to delete environment if it is main/master env.
    getProdEnv(app_id).then((res) => {
      if (res.id === +env_id) {
        setDisableDelete(true);
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteEnv = () => {
    handleCloseDialog();
    setGlobalLoading(true);
    deleteEnv({
      app_id,
      env_id,
    }).then(() => {
      Message.success("Delete environment successfully.");
      const app_id = getQuery("app_id");
      const release_id = getQuery("release_id");
      setGlobalLoading(false);
      router.push(
        `/${getUrlEncodeName()}/applications/panel?app_id=${app_id}&release_id=${release_id}`
      );
    });
  };

  return (
    <Layout notStandardLayout>
      <div className={styles.wrapper}>
        <Typography
          variant="h1"
          sx={{
            fontSize: 25,
            fontFamily: "Roboto",
          }}
        >
          Environment settings(feat-shop)
        </Typography>
        <div style={{
          marginTop: "20px"
        }}>
          <SingleCollapsiblePanel title="Danger Zone" defaultIsExpanded={true}>
            <div>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDialog}
              >
                Delete This Environment
              </Button>
            </div>
          </SingleCollapsiblePanel>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {disableDelete
            ? "Unable to Delete Main/Master Environment"
            : "Delete This Environment"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {disableDelete
              ? "Current environment is Main/Master which can't be delete directly."
              : "Please make sure you want to delete this environment because this operation is unrecoverable."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteEnv}
            disabled={disableDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
