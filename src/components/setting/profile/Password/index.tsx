import {
  Button,
  Card,
  CardActions,
  CardHeader,
  FormControl,
  FormHelperText,
  Stack,
  TextField,
} from "@mui/material";
import React from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import { PasswordReq, updatePassword } from "@/utils/api/profile";
import {Message} from "@/utils/utils";

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

const commonRules = {
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
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(value) ||
        "Must contain uppercase, lowercase, and numbers."
      );
    },
  },
};

export default function Passwords(): React.ReactElement {
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
        Message.success('Update successfully.')
        reset();
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

  return (
    <Card>
      <CardHeader title="Password" />
      <CardActions>
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={3}>
            {/** Current Password */}
            <Controller
              name={FieldsMap.CurrentPassword}
              control={control}
              render={({ field }) => (
                <FormControl
                  error={errors[FieldsMap.CurrentPassword] ? true : false}
                >
                  <TextField
                    label="Current password"
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                  ></TextField>
                  <FormHelperText>
                    {errors[FieldsMap.CurrentPassword] &&
                      errors[FieldsMap.CurrentPassword]!.message}
                  </FormHelperText>
                </FormControl>
              )}
              rules={{
                required: "Please enter current password.",
                ...commonRules,
              }}
            />
            {/** New Password */}
            <Controller
              name={FieldsMap.NewPassword}
              control={control}
              render={({ field }) => (
                <FormControl
                  error={errors[FieldsMap.NewPassword] ? true : false}
                >
                  <TextField
                    label="New password"
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                  ></TextField>
                  <FormHelperText>
                    {errors[FieldsMap.NewPassword] &&
                      errors[FieldsMap.NewPassword]!.message}
                  </FormHelperText>
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
                  error={
                    errors[FieldsMap.NewPasswordConfirmation] ? true : false
                  }
                >
                  <TextField
                    label="New password confirmation"
                    type="password"
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                  ></TextField>
                  <FormHelperText>
                    {errors[FieldsMap.NewPasswordConfirmation] &&
                      errors[FieldsMap.NewPasswordConfirmation]!.message}
                  </FormHelperText>
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
            <Button variant="contained" type="submit">
              Update password
            </Button>
          </Stack>
        </form>
      </CardActions>
    </Card>
  );
}
