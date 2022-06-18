import { NoticeRef } from "@/components/Notice";
import {
  MemberType,
  MemberTypeEnum,
  shiftRole,
  ShiftRoleReq,
} from "@/utils/api/org";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
} from "@mui/material";
import React, { useState } from "react";

interface Props {
  currentMemberType: MemberType;
  username: string;
  orgId: number;
  userId: number;
  successCallback?: Function;
}

export default function ShiftRole({
  currentMemberType,
  username,
  orgId,
  userId,
  successCallback,
}: Props): React.ReactElement {
  const [newMemberType, setNewMemberType] =
    useState<MemberType>(currentMemberType);
  const [open, setOpen] = useState(false);

  const clickHandler = () => {
    setOpen(true);
  };

  const onShiftRole = () => {
    console.log(newMemberType === currentMemberType);
    if (newMemberType === currentMemberType) {
      NoticeRef.current?.open({
        type: "warning",
        message: `${username} already is ${currentMemberType}`,
      });
      return;
    }

    const shiftRoleReq: ShiftRoleReq = {
      org_id: orgId,
      user_id: userId,
      body: {
        member_type: newMemberType,
      },
    };

    shiftRole(shiftRoleReq).then(() => {
      NoticeRef.current?.open({
        type: "success",
        message: `${username}'s role change to ${newMemberType}`,
      });
      successCallback && successCallback();
      setOpen(false);
    });
  };

  return (
    <>
      <Button onClick={clickHandler}>Role</Button>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false);
        }}
      >
        <DialogTitle>
          Change <strong>{username}</strong>&apos;s role
        </DialogTitle>
        <DialogContent>
          <Box>
            <Select
              id="shift-role"
              value={newMemberType}
              onChange={(event) => {
                setNewMemberType(event.target.value as MemberType);
              }}
              size="small"
            >
              <MenuItem value={MemberTypeEnum.Admin}>Admin</MenuItem>
              <MenuItem value={MemberTypeEnum.Member}>Member</MenuItem>
            </Select>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} autoFocus>
            Cancel
          </Button>
          <Button onClick={onShiftRole}>Confirm</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
