import React, {useEffect, useState} from "react";
import {NextPage} from "next";
import clsx from "clsx";
import {TextField, InputAdornment, IconButton} from "@mui/material";
import {useRouter} from "next/router";


import styles from "./index.module.scss";
import Image from "next/image";
import {signUpApi, SignUpReq} from "@/api/login";
import {useForm, Controller} from "react-hook-form";
import {get, omit} from "lodash-es";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {emailRule, passportRule, userNameRule} from "@/utils/formRules";
import {IconFocusStyle} from "@/pages/sign-in";
import {ForkMainLogo} from "@/utils/CDN";
import EyeOpen from "@/basicComponents/Eye/Open";
import EyeClose from "@/basicComponents/Eye/Close";
import {getQuery, setLoginToken} from "@/utils/utils";
import {getUserInfo} from "@/api/profile";
import {completeInfo} from "@/api/auth";

const inputStyle = {}

const SignUp: NextPage = () => {
  const router = useRouter();

  let isCompleteInfo = Boolean(getQuery('completeInfo'));

  const [showPassport, setShowPassport] = useState({
    pass: false,
    confirmPass: false,
  })


  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {control, handleSubmit, formState: {errors}, register, getValues, setValue} = useForm({
    defaultValues: {
      nickname: "",
      email: "",
      password: "",
      check_password: "",
    }
  });

  useEffect(() => {
    if (isCompleteInfo) {
      getUserInfo().then(res => {
        let {email, nickname} = res;
        setValue('nickname', nickname);
        setValue('email', email);
      })
    }
  }, []);


  const onSubmit = (data: SignUpReq) => {
    if (isCompleteInfo) {
      completeInfo(omit(data, ['email'])).then(res => {
        setLoginToken(res.token, res.expire_in);
        location.href = location.origin;
      })
    } else {
      signUpApi(data).then(res => {
        router.push('./signup-success');
      })
    }
  };

  const handleClickShowPassword = (key: ('pass' | "confirmPass")) => {
    setShowPassport({
      ...showPassport,
      [key]: !showPassport[key],
    });
  };


  function goSignIn() {
    router.push('/sign-in')
  }

  return (
    <div className={clsx("relative", styles.container)}>
      {/*<div className={clsx("absolute flex gap-4", styles.logo)}>*/}
      {/*  <Image*/}
      {/*    src="/img/logo/header-logo.webp"*/}
      {/*    alt="ForkMain"*/}
      {/*    width={51}*/}
      {/*    height={33}*/}
      {/*  />*/}
      {/*  <Image src="/img/logo/white-heighliner.svg" alt="Heighliner" width={111.3} height={23.5}/>*/}
      {/*</div>*/}
      <div className={styles.cardWrapper}>
        <div className={styles.logo}>
          <Image src={ForkMainLogo} layout="fill" objectFit="contain" alt=""/>
        </div>
        <div className={styles.title}>

          {
            isCompleteInfo ? 'Complete your message' : " Sign up"
          }
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller
            name="nickname"
            control={control}
            render={({field}) => (
              <TextField label="Name*"
                         sx={IconFocusStyle}
                         size="small"
                         value={field.value}
                         fullWidth
                         onChange={field.onChange}
                         error={Boolean(get(errors, ['nickname', 'message']))}
                         helperText={get(errors, ['nickname', 'message'])}
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">
                               <PersonOutlineOutlinedIcon/>
                             </InputAdornment>
                           ),
                         }}
              />
            )}
            rules={userNameRule}
          />
          <Controller
            name="email"
            control={control}
            render={({field}) => (
              <TextField label="Email*"
                         sx={IconFocusStyle}
                         size="small"
                         value={field.value}
                         onChange={field.onChange}
                         fullWidth
                         disabled={isCompleteInfo}
                         error={Boolean(get(errors, ['email', 'message']))}
                         helperText={get(errors, ['email', 'message'])}
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">
                               <EmailOutlinedIcon/>
                             </InputAdornment>
                           ),
                         }}

              />
            )}
            rules={emailRule}
          />
          <Controller
            name="password"
            control={control}
            render={({field}) => (
              <TextField label="Password*"
                         sx={IconFocusStyle}
                         size="small"
                         type={showPassport.pass ? 'text' : 'password'}
                         value={field.value}
                         onChange={field.onChange}
                         error={Boolean(get(errors, ['password', 'message']))}
                         helperText={get(errors, ['password', 'message'])}
                         fullWidth
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">
                               <LockOutlinedIcon/>
                             </InputAdornment>
                           ),
                           endAdornment: (
                             <InputAdornment position="end">
                               <IconButton
                                 onClick={() => handleClickShowPassword('pass')}
                                 onMouseDown={handleMouseDownPassword}
                                 edge="end"
                               >
                                 {showPassport.pass ? <EyeOpen/> : <EyeClose/>}
                               </IconButton>
                             </InputAdornment>
                           )
                         }}
              />
            )}
            rules={passportRule}
          />
          <Controller
            name="check_password"
            control={control}
            render={({field}) => (
              <TextField label="Confirm Password*"
                         sx={IconFocusStyle}
                         size="small"
                         fullWidth
                         type={showPassport.confirmPass ? 'text' : 'password'}
                         value={field.value}
                         onChange={field.onChange}
                         error={Boolean(get(errors, ['check_password', 'message']))}
                         helperText={get(errors, ['check_password', 'message'])}
                         InputProps={{
                           startAdornment: (
                             <InputAdornment position="start">
                               <LockOutlinedIcon/>
                             </InputAdornment>
                           ),
                           endAdornment: (
                             <InputAdornment position="end">
                               <IconButton
                                 onClick={() => handleClickShowPassword('confirmPass')}
                                 onMouseDown={handleMouseDownPassword}
                                 edge="end"
                               >
                                 {showPassport.confirmPass ? <EyeOpen/> : <EyeClose/>}
                               </IconButton>
                             </InputAdornment>
                           )
                         }}
              />
            )}
            rules={{
              required: "Please enter password again",
              validate: {
                unconformity: (value) => {
                  if (value !== getValues('password')) {
                    return "The password are not the same"
                  }
                }
              },
            }}
          />
          <input className={styles.signIn} onClick={handleSubmit(onSubmit)} type="submit" value="Sign up"/>
        </form>
        <div className={styles.action}>
          <div className={styles.btn} onClick={goSignIn}>
            Already have an account? <span onClick={goSignIn} className={styles.login}>Sign in</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
