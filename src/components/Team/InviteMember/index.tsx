import {
  invitations,
  InvitationsReq,
  inviteeSuggestions,
  InviteeSuggestionsRes,
  MemberType,
  MemberTypeEnum,
} from "@/utils/api/org";
import {getOriIdByContext, Message} from "@/utils/utils";
import {
  Autocomplete,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import React, {
  Dispatch,
  ReactElement,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { Controller, useForm } from "react-hook-form";

import styles from "./index.module.scss";

interface Props {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  inviteMemberSuccessCb?: Function;
}

export default function InviteMember({
  open,
  setOpen,
  inviteMemberSuccessCb,
}: Props): ReactElement {
  const [options, setOptions] = useState<InviteeSuggestionsRes>([]);
  // const loading = open && options.length === 0;
  const [value, setValue] = useState<InviteeSuggestionsRes[number] | null>(
    null
  );
  const [inputValue, setInputValue] = useState("");
  const [memberType, setMemberType] = useState<MemberType>(
    MemberTypeEnum.Member
  );

  useEffect(() => {
    // Can't fetch invitee suggestion list
    if (inputValue.trim().length <= 0) {
      setOptions([]);
      return;
    }

    inviteeSuggestions({
      org_id: +getOriIdByContext(),
      username: inputValue,
    }).then((res) => {
      setOptions(res);
    });
  }, [inputValue]);

  const invitation = () => {
    switch (true) {
      case value === null:
        Message.warning("You didn't choose an invitee.");
        return;
      case value?.is_member:
        Message.warning(`The user ${value?.username} has already in your team.`);
        return;
    }

    const req: InvitationsReq = {
      org_id: +getOriIdByContext(),
      body: {
        user_id: value!.user_id,
        member_type: memberType,
      },
    };

    invitations(req).then(() => {
      Message.success(`Invite the user ${value!.username} successfully!`);
      inviteMemberSuccessCb && inviteMemberSuccessCb();
    });
  };

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <DialogTitle>Invite User</DialogTitle>
      <DialogContent>
        <DialogContentText>
          You can directly invite a user to your team and set his role.
        </DialogContentText>
      </DialogContent>
      <Stack direction="row" gap={1} className={styles.row}>
        <Autocomplete
          id="combo-box-demo"
          getOptionLabel={(option) => option.username}
          options={options}
          filterOptions={(x) => x}
          isOptionEqualToValue={(option, value) =>
            option.user_id === value.user_id
          }
          className={styles.searchBar}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          noOptionsText="No suggestion."
          renderInput={(params) => <TextField {...params} label="Invitee" />}
        />
        <Select
          value={memberType}
          // label="Role"
          onChange={(event) => {
            setMemberType(event.target.value as MemberType);
          }}
        >
          <MenuItem value={MemberTypeEnum.Admin}>
            {MemberTypeEnum.Admin}
          </MenuItem>
          <MenuItem value={MemberTypeEnum.Member}>
            {MemberTypeEnum.Member}
          </MenuItem>
        </Select>
      </Stack>
      <DialogActions>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button onClick={invitation}>Invitation</Button>
      </DialogActions>
    </Dialog>
  );
}
