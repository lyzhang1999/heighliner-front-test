/**
 * New sign-in page for Forkmain
 */
import {
  Button,
  FormControl,
  IconButton,
  InputAdornment,
  TextField,
  Checkbox
} from "@mui/material";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useContext, useState } from "react";
import {
  Controller,
  FieldValues,
  SubmitHandler,
  useForm,
} from "react-hook-form";
import { trim } from "lodash-es";

import { ForkMainLogo } from "@/utils/CDN";
import Email from "/public/img/entrance/sign-in/Email.svg";
import Lock from "/public/img/entrance/sign-in/Lock.svg";
import EyeOpen from "@/basicComponents/Eye/Open";
import EyeClose from "@/basicComponents/Eye/Close";
import { getAuthToken, GetAuthTokenReq, LoginType } from "@/api/auth";
import { setLoginToken } from "@/utils/utils";
import { Context } from "@/utils/store";
import GlobalLoading from "@/basicComponents/GlobalLoading";
import usePasswordEye from "@/hooks/passwordEye";
import GitHub from "@/components/sign-in/GitHub.tsx";
import useRedirectCurrentOrganization from "@/hooks/redirectCurrentOrganization";

import styles from "./index.module.scss";

const FieldMap = {
  Email: "Email",
  Password: "Password",
  Remember: 'Remember'
};

export const IconFocusStyle = {
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
  const [openGlobalLoading, setOpenGlobalLoading] = useState(false);
  const router = useRouter();
  const { dispatch } = useContext(Context);
  const {
    control,
    handleSubmit,
    formState: { errors },
    setError,
    getValues,
    setValue,
  } = useForm({
    defaultValues: {
      [FieldMap.Email]: "",
      [FieldMap.Password]: "",
      [FieldMap.Remember]: false,
    },
  });
  const [eyeStatus, reverseEyeStatus, type] = usePasswordEye();

  const gotoSignUpPage = () => {
    router.push(`/sign-up`);
  };

  const redirectCurrentOrganization = useRedirectCurrentOrganization();

  const onSignIn: SubmitHandler<FieldValues> = (data) => {
    setOpenGlobalLoading(true);

    const req: GetAuthTokenReq = {
      login_type: LoginType.Email,
      rememberMe: data[FieldMap.Remember],
      body: {
        email: trim(data[FieldMap.Email]),
        password: trim(data[FieldMap.Password]),
      },
    };

    getAuthToken(req)
      .then((res) => {
        setLoginToken(res.token, res.expire_in);
        redirectCurrentOrganization();
      })
      .catch((err) => {
        console.error(err);
        const { data } = err.response;
        switch (data.err_msg) {
          case "record not found":
            setError(FieldMap.Email, {
              message:
                "There is no ForkMain account associated with this email address.",
            });
            break;
          case "email or password wrong":
            setError(FieldMap.Email, {
              message: "Please check your email if is correct.",
            });
            setError(FieldMap.Password, {
              message: "Please check your password if is correct.",
            });
        }
      })
      .finally(() => {
        setOpenGlobalLoading(false);
      });
  };

  return (
    <div className={styles.container}>
      <div className={styles.signInWrap}>
        <div className={styles.logo}>
          <Image src={ForkMainLogo} layout="fill" objectFit="contain" alt="" />
        </div>
        <h1 className={styles.title}>sign in</h1>
        <div style={{ marginTop: "25px" }}>
          <GitHub />
        </div>
        <div className={styles.splitter}>or</div>
        <form onSubmit={handleSubmit(onSignIn)}>
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
                  onChange={field.onChange}
                  className={styles.emailInput}
                  sx={IconFocusStyle}
                  type="email"
                  helperText={errors[FieldMap.Email]?.message}
                  error={errors[FieldMap.Email] !== undefined}
                />
              </FormControl>
            )}
            rules={{
              required: "Please enter your email.",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Please enter valid email.",
              },
            }}
          />
          <Controller
            control={control}
            name={FieldMap.Password}
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
                        <IconButton onClick={reverseEyeStatus}>
                          {eyeStatus ? <EyeOpen /> : <EyeClose />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  onChange={field.onChange}
                  className={styles.passwordInput}
                  sx={IconFocusStyle}
                  type={type}
                  helperText={errors[FieldMap.Password]?.message}
                  error={errors[FieldMap.Password] !== undefined}
                />
              </FormControl>
            )}
            rules={{
              required: "Please enter your password.",
            }}
          />
          <div className={styles.tips}>
            <div>
              <Controller
                control={control}
                name={FieldMap.Remember}
                render={({field}) => (
                  // <div>{JSON.stringify(field.value) }</div>
                  <div className={""}>
                    <Checkbox size="small"
                              checked={field.value as boolean}
                              onChange={field.onChange}/>
                    <span className={styles.desc} onClick={() => {
                      setValue(FieldMap.Remember, !getValues(FieldMap.Remember))
                    }}>Remember me</span>
                  </div>
                )}
              />
            </div>
          </div>
          <Button
            variant="contained"
            className={styles.signInBtn}
            type="submit"
          >
            Sign in
          </Button>
          <p className={styles.noAccountPrompt}>Have no account yet?</p>
          <Button
            variant="outlined"
            className={styles.signUpBtn}
            onClick={gotoSignUpPage}
          >
            Sign up
          </Button>
        </form>
      </div>
      <GlobalLoading
        {...{
          openGlobalLoading,
          title: "Sign in ...",
        }}
      />
    </div>
  );
}
