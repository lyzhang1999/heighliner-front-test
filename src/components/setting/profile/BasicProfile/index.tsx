import React, { useContext, useEffect, useState } from "react";
import { ErrorCode, useDropzone } from "react-dropzone";
import {
  Avatar,
  Button,
  FormControl,
  FormHelperText,
  TextField,
} from "@mui/material";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { fileToBase64, Message } from "@/utils/utils";
import { Context } from "@/utils/store";
import { BasicProfileReq, updateBasicProfile } from "@/api/profile";

import styles from "./index.module.scss";

enum BasicProfileFieldMap {
  avatar = "avatar",
  username = "username",
}

export default function BasicProfile(): React.ReactElement {
  const [usernameEditing, setUsernameEditing] = useState(false);
  const { state: globalState, dispatch: globalStateDispatch } =
    useContext(Context);

  // Avatar updater
  const { acceptedFiles, fileRejections, getRootProps, getInputProps } =
    useDropzone({
      accept: { "image/*": [".png", ".webp", ".jpeg", ".jpg"] },
      noDrag: true,
      noKeyboard: true,
      maxFiles: 1,
      maxSize: 1e6, // 1MB
    });

  // Form controller
  const defaultBasicProfileField = {
    [BasicProfileFieldMap.avatar]: globalState.userInfo?.avatar,
    [BasicProfileFieldMap.username]: globalState.userInfo?.username,
  };
  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: defaultBasicProfileField,
  });

  // Transfer image uploaded into base64 string and update it.
  useEffect(() => {
    if (acceptedFiles[0]) {
      fileToBase64(acceptedFiles[0])
        .then((base64) => {
          const req: BasicProfileReq = {
            avatar: base64 as string,
          };

          updateBasicProfile(req).then(() => {
            globalStateDispatch({
              userInfo: {
                ...globalState.userInfo,
                avatar: base64,
              },
            });
            setValue(BasicProfileFieldMap.avatar, base64 as string);
            Message.success("Avatar Update successfully.");
          });
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
              Message.error("File is larger than acceptable size (1MB).");
              break;
            default:
              Message.error(error.message);
          }
        });
      });
    }
  }, [fileRejections]);

  const onKeydownHandler = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      handleSubmit(updateUsername)(event);
    }
  };

  const updateUsername: SubmitHandler<FieldValues> = (data) => {
    const newUsername = data[BasicProfileFieldMap.username];

    const req: BasicProfileReq = {
      username: newUsername,
    };

    updateBasicProfile(req).then(() => {
      globalStateDispatch({
        userInfo: {
          ...globalState.userInfo,
          username: newUsername,
        },
      });
      Message.success("Update username successfully.");
      setUsernameEditing(false);
    });
  };

  return (
    <div className={styles.wrapper}>
      <Controller
        name={BasicProfileFieldMap.avatar}
        control={control}
        render={({ field }) => (
          <div className={styles.avatarWrap}>
            <h2>Avatar</h2>
            <Avatar src={field.value} className={styles.avatar}></Avatar>
            <Button>
              <div {...getRootProps({ className: "dropzone" })}>
                <input {...getInputProps()} />
                Upload
              </div>
            </Button>
          </div>
        )}
      />
      <Controller
        control={control}
        name={BasicProfileFieldMap["username"]}
        render={({ field }) => (
          <FormControl
            error={errors[BasicProfileFieldMap["username"]] ? true : false}
          >
            <div className={styles.usernameWrapper}>
              <h2>Name</h2>
              {usernameEditing ? (
                <div className={styles.usernameWrap}>
                  <TextField
                    // label="Username"
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                    onKeyDown={onKeydownHandler}
                  ></TextField>
                  <FormHelperText>
                    {errors[BasicProfileFieldMap["username"]] &&
                      errors[BasicProfileFieldMap["username"]]!.message}
                  </FormHelperText>
                  <button
                    className={styles.changeBtn}
                    onClick={handleSubmit(updateUsername)}
                  ></button>
                  <button
                    className={styles.cancelBtn}
                    onClick={() => {
                      setUsernameEditing(false);
                    }}
                  ></button>
                </div>
              ) : (
                <div className={styles.usernameTextWrap}>
                  <p>{globalState.userInfo?.username}</p>
                  <Button onClick={() => setUsernameEditing(true)}>Edit</Button>
                </div>
              )}
            </div>
          </FormControl>
        )}
        rules={{
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
            message:
              "Only contain alphanumeric characters, hyphen(-), and underscore(_)",
          },
          validate: {
            sameWithOld: (value) =>
              value !== defaultBasicProfileField.username ||
              "Nothing changed to the username.",
          },
        }}
      />
    </div>
  );
}
