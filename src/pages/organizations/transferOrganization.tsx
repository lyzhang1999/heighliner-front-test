import {Button, TextField, Dialog, DialogTitle, DialogActions, DialogContent} from "@mui/material";
import * as React from "react";
import {useState} from "react";
import {NoticeRef} from "@/components/Notice";
import {createOrg, deleteOri} from "@/utils/api/org";

interface Props {
  transferModalVisible: boolean,
  transferSuccessCb: () => void,
  setTransferModalVisible: (val: boolean) => void,
  transferId: number
}

export const TransferOrganization = (props: Props) => {
  let {transferModalVisible, transferSuccessCb, setTransferModalVisible, transferId} = props;

  const handleClose = () => {
    setTransferModalVisible(false);
  };

  function deleteIt() {

    deleteOri({org_id: deleteID}).then(res => {
      NoticeRef.current?.open({
        message: "Delete Organization Success",
        type: "success",
      });
      setTransferModalVisible(false);
    })
  }

  return (
    <Dialog
      open={transferModalVisible}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are yuo sure to delete the Organization?
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={deleteIt} variant="contained"
                color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}
