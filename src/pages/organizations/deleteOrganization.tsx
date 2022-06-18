import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Button} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import {deleteOri} from "@/utils/api/org";
import {Message} from "@/utils/utils";

interface Props {
  deleteModalVisible: boolean,
  deleteSuccessCb: () => void,
  setDeleteModalVisible: (val: boolean) => void,
  deleteID: number
}

const DeleteOrganization = (props: Props) => {
  let {deleteModalVisible, deleteSuccessCb, setDeleteModalVisible, deleteID} = props;

  const handleClose = () => {
    setDeleteModalVisible(false);
  };

  function deleteIt() {
    deleteOri({org_id: deleteID}).then(res => {
      Message.success("Delete Organization Success");
      setDeleteModalVisible(false);
      deleteSuccessCb();
    })
  }

  return (
    <Dialog
      open={deleteModalVisible}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are yuo sure to delete the Organization?
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={deleteIt}
                color="error"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteOrganization;
