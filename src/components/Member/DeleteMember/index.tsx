import {deleteMember} from "@/utils/api/org";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, {useState} from "react";
import {Message} from "@/utils/utils";

interface Props {
  userId: number;
  orgId: number;
  username: string;
  successCallback?: Function;
}

export default function Delete({
  userId,
  orgId,
  username,
  successCallback,
}: Props): React.ReactElement {
  const [open, setOpen] = useState(false);

  const clickHandler = () => {
    setOpen(true);
  };

  const toDeleteMember = () => {
    deleteMember({
      user_id: userId,
      org_id: orgId,
    })
      .then(() => {
        Message.success(`Delete member ${username} success`)
        successCallback && successCallback();
      })
      .finally(() => {
        setOpen(false);
      });
  };

  return (
    <>
      <Button onClick={clickHandler}
              color="error"
      >Delete</Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>
          Are you sure want to delete the member <strong>{username}</strong> ?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            This operation will remove the member from the team. His resources
            and records also are erased.
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{padding: '16px 24px'}}
        >
          <Button onClick={() => setOpen(false)} autoFocus>
            Cancel
          </Button>
          <Button onClick={toDeleteMember}
                  color="error"
                  variant="contained"
          >Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
