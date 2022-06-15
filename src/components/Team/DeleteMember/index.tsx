import { NoticeRef } from "@/components/Notice";
import { deleteMember } from "@/utils/api/org";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import React, { useState } from "react";

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
        NoticeRef.current?.open({
          type: "success",
          message: `Delete member ${username} success`,
        });
        successCallback && successCallback();
      })
      .finally(() => {
        setOpen(false);
      });
  };

  return (
    <>
      <Button onClick={clickHandler}>Delete</Button>
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
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            Cancel
          </Button>
          <Button onClick={toDeleteMember}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
