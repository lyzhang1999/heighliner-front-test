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

import { fileToBase64 } from "@/utils/utils";
import { NoticeRef } from "@/components/Notice";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { BasicProfileReq, updateBasicProfile } from "@/utils/api/profile";

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

  // Transfer image uploaded into base64 string
  useEffect(() => {
    if (acceptedFiles[0]) {
      fileToBase64(acceptedFiles[0])
        .then((base64) => {
          // setAvatarInBase64(base64 as string);
          setValue(BasicProfileFieldMap.avatar, base64 as string);
        })
        .catch((err) => {
          NoticeRef.current?.open({
            message: "Avatar image compile error.",
            type: "error",
          });
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
              NoticeRef.current?.open({
                type: "error",
                message: "File is larger than acceptable size (1MB).",
              });
              break;
            default:
              NoticeRef.current?.open({
                type: "error",
                message: error.message,
              });
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
      NoticeRef.current?.open({
        type: "warning",
        message: "You change nothing.",
      });
      return;
    }

    updateBasicProfile(req).then(() => {
      NoticeRef.current?.open({
        type: "success",
        message: "Update basic profile successfully.",
      });
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
