import { BasicProfileReq, updateBasicProfile } from "@/api/profile";
import { Context } from "@/utils/store";
import { Message } from "@/utils/utils";
import { Button, FormControl, FormHelperText, TextField } from "@mui/material";
import React, { useContext, useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";

import styles from "./index.module.scss";

export default function Email(): React.ReactElement {
  const { state: globalState, dispatch: globalStateDispatch } =
    useContext(Context);
  const [email, setEmail] = useState(globalState.userInfo?.email);
  const [editing, setEditing] = useState(false);

  const {
    control,
    formState: { errors },
    handleSubmit,
    setValue,
  } = useForm({
    defaultValues: {
      email: globalState.userInfo?.email,
    },
  });

  const onKeydownHandler = (event: React.KeyboardEvent) => {
    if (event.code === "Enter") {
      handleSubmit(updateEmail)(event);
    }
  };

  const updateEmail: SubmitHandler<FieldValues> = (data) => {
    const email = data["email"];
    const req: BasicProfileReq = {
      email: email,
    };

    updateBasicProfile(req).then(() => {
      globalStateDispatch({
        userInfo: {
          ...globalState.userInfo,
          email: email,
        },
      });
      Message.success("Update email successfully.");
      setEditing(false);
    });
  };

  return (
    <Controller
      control={control}
      name="email"
      render={({ field }) => (
        <FormControl
          error={errors["email"] ? true : false}
          className={styles.emailWrapper}
          sx={{
            display: "grid",
            gridTemplateColumns: "133px 1fr 45px",
            padding: "26px 36px 26px 28px",
          }}
        >
          <h2>Email Address</h2>
          {editing ? (
            <div className={styles.emailWrap}>
              <TextField
                value={field.value}
                onChange={field.onChange}
                size="small"
                onKeyDown={onKeydownHandler}
              ></TextField>
              <FormHelperText>
                {errors["email"] && errors["email"]!.message}
              </FormHelperText>
              <button
                className={styles.changeBtn}
                onClick={handleSubmit(updateEmail)}
              ></button>
              <button
                className={styles.cancelBtn}
                onClick={() => {
                  setEditing(false);
                }}
              ></button>
            </div>
          ) : (
            <>
              <p>{globalState.userInfo?.email}</p>
              <Button 
                // onClick={() => setEditing(true)}
              >Edit</Button>
            </>
          )}
        </FormControl>
      )}
      rules={{
        pattern: {
          value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
          message: "Please enter valid email.",
        },
        validate: {
          sameWithOld: (value) =>
            value !== globalState.userInfo?.email ||
            "Nothing changed to the email.",
        },
      }}
    />
  );
}
