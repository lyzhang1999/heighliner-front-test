import {
  invitations,
  InvitationsReq,
  inviteeSuggestions,
  InviteeSuggestionsRes,
  MemberType,
  MemberTypeEnum,
} from "@/utils/api/org";
import { getOriIdByContext, Message } from "@/utils/utils";
import {
  Autocomplete,
  Button,
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
  // const [options, setOptions] = useState<InviteeSuggestionsRes>([]);
  // const [value, setValue] = useState<InviteeSuggestionsRes[number] | null>(
  //   null
  // );
  // const [inputValue, setInputValue] = useState("");
  const [memberType, setMemberType] = useState<MemberType>(
    MemberTypeEnum.Member
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
    },
  });

  // useEffect(() => {
  //   if(open === true){
  //     setOptions([]);
  //     setValue(null);
  //     setInputValue('');
  //   }
  // }, [open])

  // useEffect(() => {
  //   // Can't fetch invitee suggestion list
  //   if (inputValue.trim().length <= 0) {
  //     setOptions([]);
  //     return;
  //   }

  //   inviteeSuggestions({
  //     org_id: +getOriIdByContext(),
  //     username: inputValue,
  //   }).then((res) => {
  //     setOptions(res);
  //   });
  // }, [inputValue]);

  // const invitation = () => {
  //   switch (true) {
  //     case value === null:
  //       Message.warning("You didn't choose an invitee.");
  //       return;
  //     case value?.is_member:
  //       Message.warning(`The user ${value?.username} has already in your team.`);
  //       return;
  //   }

  //   const req: InvitationsReq = {
  //     org_id: +getOriIdByContext(),
  //     body: {
  //       user_id: value!.user_id,
  //       member_type: memberType,
  //     },
  //   };

  //   invitations(req).then(() => {
  //     Message.success(`Invite the user ${value!.username} successfully!`);
  //     inviteMemberSuccessCb && inviteMemberSuccessCb();
  //   });
  // };

  const invitation = () => {};

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
          You can invite a user to your team by email.
        </DialogContentText>
      </DialogContent>
      <Stack direction="row" gap={1} className={styles.row}>
        {/* <Autocomplete
          size="small"
          id="combo-box-demo"
          getOptionLabel={(option) => option.username}
          options={options}
          filterOptions={(x) => x}
          isOptionEqualToValue={(option, value) =>
            option.user_id === value.user_id
          }
          getOptionDisabled={(option) => option?.is_member}
          className={styles.searchBar}
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
          }}
          inputValue={inputValue}
          onInputChange={(event, newInputValue) => {
            setInputValue(newInputValue);
          }}
          noOptionsText="Can`t match any user"
          renderInput={(params) => <TextField {...params} label="Invitee"/>}
        /> */}
        <Controller
          name="email"
          control={control}
          render={({ field, fieldState }) => (
            <TextField
              value={field.value}
              type="email"
              label="Email"
              onChange={field.onChange}
              helperText={errors.email?.message}
              error={errors.email !== undefined}
            />
          )}
          rules={{
            required: "Please enter invitee email.",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address.",
            },
          }}
        />
        <Select
          value={memberType}
          size="small"
          sx={{ minWidth: "120px", maxHeight: "56px" }}
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
      <DialogActions sx={{ padding: "30px 24px 16px 30px" }}>
        <Button
          onClick={() => {
            setOpen(false);
          }}
        >
          Cancel
        </Button>
        <Button onClick={handleSubmit(invitation)} variant="contained">
          Invitation
        </Button>
      </DialogActions>
    </Dialog>
  );
}
