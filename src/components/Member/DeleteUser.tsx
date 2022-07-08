import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Button} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import {deleteMember, deleteOri} from "@/utils/api/org";
import {Message} from "@/utils/utils";

interface Props {
  deleteModalVisible: boolean,
  deleteSuccessCb: () => void,
  setDeleteModalVisible: (val: boolean) => void,
  deleteID: number
}

const DeleteUser = (props: Props) => {
  let {deleteModalVisible, deleteSuccessCb, setDeleteModalVisible, deleteID} = props;

  const handleClose = () => {
    setDeleteModalVisible(false);
  };

  function deleteIt() {
    deleteMember(deleteID).then(res => {
      Message.success("Delete User Success");
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
        Are yuo sure to delete the User?
      </DialogTitle>
      <DialogActions
        sx={{padding: '16px 24px'}}
      >
        <Button onClick={handleClose}
                variant="outlined"
        >Cancel</Button>
        <Button onClick={deleteIt}
                color="error"
                variant="outlined"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default DeleteUser;
