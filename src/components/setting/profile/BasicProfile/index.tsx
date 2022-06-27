import {
  Avatar,
  Button,
  Card,
  CardActions,
  CardHeader,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";

import {fileToBase64, Message} from "@/utils/utils";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { BasicProfileReq, updateBasicProfile } from "@/utils/api/profile";
import ContextHook from "@/hooks/contextHook";

enum BasicProfileFieldMap {
  avatar = "avatar",
  username = "username",
}

const defaultBasicProfileField = {
  [BasicProfileFieldMap.avatar]: "",
  [BasicProfileFieldMap.username]: "",
};

export default function BasicProfile(): React.ReactElement {
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: { "image/*": [".png", ".webp", ".jpeg", ".jpg"] },
      noDrag: true,
      noKeyboard: true,
      maxFiles: 1,
      maxSize: 1e6, // 1MB
    });

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: defaultBasicProfileField,
  });

  let {dispatch} = ContextHook();

  // Transfer image uploaded into base64 string
  useEffect(() => {
    if (acceptedFiles[0]) {
      fileToBase64(acceptedFiles[0])
        .then((base64) => {
          // setAvatarInBase64(base64 as string);
          setValue(BasicProfileFieldMap.avatar, base64 as string);
        })
        .catch((err) => {
          Message.error("Avatar image compile error.");
        });
    }
  }, [acceptedFiles]);

  // Show unacceptable file errors
  useEffect(() => {
    if (fileRejections.length > 0) {
      fileRejections.map(({ file, errors }) => {
        errors.map((error) => {
          switch (error.code) {
            case ErrorCode.FileTooLarge:
              Message.error("File is larger than acceptable size (1MB).")
              break;
            default:
              Message.error(error.message)
          }
        });
      });
    }
  }, [fileRejections]);

  const updateUserBasicProfile: SubmitHandler<FieldValues> = (data) => {
    const req: BasicProfileReq = {};

    if (data[BasicProfileFieldMap.avatar]) {
      req.avatar = data[BasicProfileFieldMap.avatar];
    }
    if (data[BasicProfileFieldMap.username]) {
      req.username = data[BasicProfileFieldMap.username];
    }

    if (Object.keys(req).length <= 0) {
      Message.warning('You change nothing.')
      return;
    }

    updateBasicProfile(req).then((res) => {
      dispatch({userInfo: res})
      Message.success("Update basic profile successfully.");
    });
  };

  return (
    <Card>
      <CardHeader title="Basic Profile" />
      <CardActions>
        <form onSubmit={handleSubmit(updateUserBasicProfile)}>
          <Stack spacing={5}>
            <Controller
              name={BasicProfileFieldMap.avatar}
              control={control}
              render={({ field }) => (
                <div {...getRootProps({ className: "dropzone" })}>
                  <input {...getInputProps()} />
                  <Stack direction="row" spacing={2}>
                    <Avatar src={field.value}></Avatar>
                    <Button variant="outlined">Upload Avatar</Button>
                  </Stack>
                </div>
              )}
            />
            <Controller
              control={control}
              name={BasicProfileFieldMap["username"]}
              render={({ field }) => (
                <FormControl
                  error={
                    errors[BasicProfileFieldMap["username"]] ? true : false
                  }
                >
                  <TextField
                    label="Username"
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                  ></TextField>
                  <FormHelperText>
                    {errors[BasicProfileFieldMap["username"]] &&
                      errors[BasicProfileFieldMap["username"]]!.message}
                  </FormHelperText>
                </FormControl>
              )}
              rules={{
                // required: "Please enter your username.",
                minLength: {
                  value: 5,
                  message: "At least 5 characters.",
                },
                maxLength: {
                  value: 20,
                  message: "At most 20 characters.",
                },
                pattern: {
                  value: /^[-_a-zA-Z0-9]*$/,
                  message: "Only contain letter, hyphen(-), and underscore(_)",
                },
              }}
            />
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Stack>
        </form>
      </CardActions>
    </Card>
  );
}
