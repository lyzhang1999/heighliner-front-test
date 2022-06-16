import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import {Button} from "@mui/material";
import DialogActions from "@mui/material/DialogActions";
import * as React from "react";
import {NoticeRef} from "@/components/Notice";
import {leaveOriApi} from "@/utils/api/org";

interface Props {
  leaveModalVisible: boolean,
  leaveModalCb: () => void,
  setLeaveModalVisible: (val: boolean) => void,
  leaveId: number
}

const LeavePrganization = (props: Props) => {
  let {leaveModalVisible, leaveModalCb, setLeaveModalVisible, leaveId} = props;

  const handleClose = () => {
    setLeaveModalVisible(false);
  };

  function deleteIt() {
    leaveOriApi({org_id: leaveId}).then(res => {
      NoticeRef.current?.open({
        message: "Leave Success",
        type: "success",
      });
      setLeaveModalVisible(false);
      leaveModalCb();
    })
  }

  return (
    <Dialog
      open={leaveModalVisible}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Are yuo sure to leave the organization?
      </DialogTitle>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={deleteIt}
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default LeavePrganization;