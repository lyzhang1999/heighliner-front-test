import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Button} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import {Message} from "@/utils/utils";
import {deleteApplication} from "@/api/application";

interface Props {
  deleteModalVisible: boolean,
  deleteSuccessCb: () => void,
  setDeleteModalVisible: (val: boolean) => void,
  deleteID: number,
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>,
}

const DeleteApplication = (props: Props) => {
  let {deleteModalVisible, deleteSuccessCb, setDeleteModalVisible, deleteID, setAnchorEl} = props;

  const handleClose = () => {
    setAnchorEl(null);
    setDeleteModalVisible(false);
  };

  function deleteIt() {
    deleteApplication(deleteID).then(res => {
      Message.success("Delete Application Success");
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
        Are yuo sure to delete the Application?
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

export default DeleteApplication;
