import {
  Button,
  Dialog,
  FormControl,
  FormHelperText,
  InputAdornment,
  TextField,
} from "@mui/material";
import React, { Reducer, useReducer, useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { cloneDeep } from "lodash-es";

import { PasswordReq, updatePassword } from "@/api/profile";
import { Message } from "@/utils/utils";
import {PassportReg} from "@/utils/config";
import EyeOpen from "@/basicComponents/Eye/Open";
import EyeClose from "@/basicComponents/Eye/Close";


import styles from "./index.module.scss";

enum Password {
  Old = "Old",
  New = "New",
  NewConfirmation = "NewConfirmation",
  All = "All",
}

enum FieldsMap {
  CurrentPassword = "CurrentPassword",
  NewPassword = "NewPassword",
  NewPasswordConfirmation = "NewPasswordConfirmation",
}

const defaultValues = {
  [FieldsMap.CurrentPassword]: "",
  [FieldsMap.NewPassword]: "",
  [FieldsMap.NewPasswordConfirmation]: "",
};

export const commonRules = {
  minLength: {
    value: 8,
    message: "At least 8 characters.",
  },
  maxLength: {
    value: 20,
    message: "At most 20 characters.",
  },
  validate: {
    regexp: (value: string) => {
      return (
        PassportReg.test(value) ||
        "Must contain uppercase, lowercase, and numbers."
      );
    },
  },
};

export default function Passwords(): React.ReactElement {
  const [open, setOpen] = useState(false);
  const [showPassword, dispatchShowPassword] = useShowPassword();

  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
    reset();
    dispatchShowPassword({
      type: Password.All,
      payload: false
    })
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
    reset,
    setError,
  } = useForm<typeof defaultValues>({
    defaultValues,
  });

  const onSubmit: SubmitHandler<FieldValues> = (data) => {
    const req: PasswordReq = {
      old_password: data[FieldsMap.CurrentPassword],
      new_password: data[FieldsMap.NewPassword],
      check_new_password: data[FieldsMap.NewPasswordConfirmation],
    };
    updatePassword(req)
      .then(() => {
        handleClose();
        Message.success("Update successfully.");
      })
      .catch((err) => {
        const { err_msg } = err.response.data;
        if (err_msg === "invalid password") {
          setError(FieldsMap.CurrentPassword, {
            type: "Incorrect current password",
            message: "Incorrect current password",
          });
        } else {
          Message.error(err_msg);
        }
      });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };

  return (
    <>
      <div className={styles.passwordWrapper}>
        <h2>Password</h2>
        <p>···············</p>
        <Button onClick={handleOpen}>Change my password</Button>
      </div>
      <Dialog open={open} onClose={handleClose} className={styles.dialog}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className={styles.changePasswordWrapper}
        >
          <h1>Reset Password</h1>
          {/** Current Password */}
          <Controller
            name={FieldsMap.CurrentPassword}
            control={control}
            render={({ field }) => (
              <FormControl
                error={errors[FieldsMap.CurrentPassword] ? true : false}
                className={styles.passwordWrap}
              >
                <h2>Old Password</h2>
                <div className={styles.passwordField}>
                  <TextField
                    // label="Current password"
                    type={showPassword[Password.Old] ? "text" : "password"}
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            onClick={() => {
                              dispatchShowPassword({ type: Password.Old });
                            }}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword[Password.Old] ? (
                              <EyeOpen />
                            ) : (
                              <EyeClose />
                            )}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    className={styles.password}
                  ></TextField>
                  <FormHelperText>
                    {errors[FieldsMap.CurrentPassword] &&
                      errors[FieldsMap.CurrentPassword]!.message}
                  </FormHelperText>
                </div>
              </FormControl>
            )}
            rules={{
              required: "Please enter current password.",
              // ...commonRules,
            }}
          />
          {/** New Password */}
          <Controller
            name={FieldsMap.NewPassword}
            control={control}
            render={({ field }) => (
              <FormControl
                error={errors[FieldsMap.NewPassword] ? true : false}
                className={styles.passwordWrap}
              >
                <h2>New Password</h2>
                <div>
                  <TextField
                    type={showPassword[Password.New] ? "text" : "password"}
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            onClick={() => {
                              dispatchShowPassword({ type: Password.New });
                            }}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword[Password.New] ? (
                              <EyeOpen />
                            ) : (
                              <EyeClose />
                            )}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    className={styles.password}
                  ></TextField>
                  <FormHelperText>
                    {errors[FieldsMap.NewPassword] &&
                      errors[FieldsMap.NewPassword]!.message}
                  </FormHelperText>
                </div>
              </FormControl>
            )}
            rules={{
              required: "Please enter new password.",
              ...commonRules,
            }}
          />
          {/** New Password Confirmation */}
          <Controller
            name={FieldsMap.NewPasswordConfirmation}
            control={control}
            render={({ field }) => (
              <FormControl
                error={errors[FieldsMap.NewPasswordConfirmation] ? true : false}
                className={styles.passwordWrap}
              >
                <h2>Confirm Your Password</h2>
                <div>
                  <TextField
                    // label="New password confirmation"
                    type={
                      showPassword[Password.NewConfirmation]
                        ? "text"
                        : "password"
                    }
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Button
                            onClick={() => {
                              dispatchShowPassword({
                                type: Password.NewConfirmation,
                              });
                            }}
                            onMouseDown={handleMouseDownPassword}
                          >
                            {showPassword[Password.NewConfirmation] ? (
                              <EyeOpen />
                            ) : (
                              <EyeClose />
                            )}
                          </Button>
                        </InputAdornment>
                      ),
                    }}
                    className={styles.password}
                  ></TextField>
                  <FormHelperText>
                    {errors[FieldsMap.NewPasswordConfirmation] &&
                      errors[FieldsMap.NewPasswordConfirmation]!.message}
                  </FormHelperText>
                </div>
              </FormControl>
            )}
            rules={{
              required: "Please enter new password again.",
              ...commonRules,
              validate: {
                unconformity: (newPasswordConfirmation) => {
                  const newPassword = getValues(FieldsMap.NewPassword);
                  return (
                    newPassword === newPasswordConfirmation ||
                    "Two password didn't match."
                  );
                },
                ...commonRules.validate,
              },
            }}
          />
          <div className={styles.buttonGroup}>
            <Button variant="contained" type="submit">
              Change my password
            </Button>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
          </div>
        </form>
      </Dialog>
    </>
  );
}

function useShowPassword() {
  const initialState = {
    [Password.Old]: false,
    [Password.New]: false,
    [Password.NewConfirmation]: false,
  };

  const reducer: Reducer<
    typeof initialState,
    | {
        type: Password.Old | Password.New | Password.NewConfirmation;
      }
    | {
        type: Password.All;
        payload: boolean;
      }
  > = (preState, action) => {
    const nextState = cloneDeep(preState);

    switch (action.type) {
      case Password.Old:
        nextState[Password.Old] = !preState[Password.Old];
        break;
      case Password.New:
        nextState[Password.New] = !preState[Password.New];
        break;
      case Password.NewConfirmation:
        nextState[Password.NewConfirmation] =
          !preState[Password.NewConfirmation];
        break;
      case Password.All:
        nextState[Password.Old] = action.payload;
        nextState[Password.New] = action.payload;
        nextState[Password.NewConfirmation] = action.payload;
        break;
    }

    return nextState;
  };

  return useReducer(reducer, initialState);
}
