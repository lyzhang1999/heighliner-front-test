/**
 * New sign-in page for Forkmain
 */
import { Button, FormControl, InputAdornment, TextField } from "@mui/material";
import Image from "next/image";
import React, { useState } from "react";
import { Controller, useForm } from "react-hook-form";

import { ForkMainLogo } from "@/utils/CDN";
import Email from "/public/img/entrance/sign-in/Email.svg";
import Lock from "/public/img/entrance/sign-in/Lock.svg";
import EyeOpen from "/public/img/eye/open.svg";
import EyeClose from "/public/img/eye/close.svg";

import styles from "./index.module.scss";

const FieldMap = {
  Email: "Email",
  Password: "Password",
};

const IconFocusStyle = {
  "& .MuiOutlinedInput-root.Mui-focused": {
    "& > fieldset": {
      borderColor: "#1b51b9",
    },
    "& svg": {
      color: "#1b51b9",
    },
  },
};

export default function SignIn(): React.ReactElement {
  const { control } = useForm();

  return (
    <div className={styles.container}>
      <div className={styles.signInWrap}>
        <div className={styles.logo}>
          <Image src={ForkMainLogo} layout="fill" objectFit="contain" alt="" />
        </div>
        <h1 className={styles.title}>sign in</h1>
        <Button variant="outlined" className={styles.signInGitHubBtn}>
          Sign in with GitHub
        </Button>
        <div className={styles.splitter}>or</div>
        <form>
          <Controller
            control={control}
            name={FieldMap.Email}
            render={({ field }) => (
              <FormControl className={styles.emailFieldWrap}>
                <TextField
                  label="Email*"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Email />
                      </InputAdornment>
                    ),
                  }}
                  className={styles.emailInput}
                  sx={IconFocusStyle}
                />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name={FieldMap.Email}
            render={({ field }) => (
              <FormControl className={styles.passwordFieldWrap}>
                <TextField
                  label="Password*"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Lock />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <EyeClose />
                      </InputAdornment>
                    ),
                  }}
                  className={styles.passwordInput}
                  sx={IconFocusStyle}
                />
              </FormControl>
            )}
          />
          <p className={styles.forgotPassword}>Forgot password?</p>
          <Button variant="contained" className={styles.signInBtn}>
            Sign in
          </Button>
          <p className={styles.noAccountPrompt}>Have no account yet?</p>
          <Button variant="outlined" className={styles.signUpBtn}>
            Sign up
          </Button>
        </form>
      </div>
    </div>
  );
}
