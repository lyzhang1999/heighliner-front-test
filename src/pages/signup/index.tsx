import {useState} from "react";
import {NextPage} from "next";
import clsx from "clsx";
import {TextField, InputAdornment, IconButton} from "@mui/material";
import {useRouter} from "next/router";

import styles from "./index.module.scss";
import Image from "next/image";
import {signUpApi} from "@/api/login";
import {Message} from "@/utils/utils";
import {PassportReg} from "@/utils/config";
import {checkInput, checkAllParams, RuleItem, RuleKey} from './formUtil';
import {useForm, Controller} from "react-hook-form";
import {get} from "lodash-es";
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined';
import {VisibilityOff, Visibility} from "@mui/icons-material";
import EmailOutlinedIcon from '@mui/icons-material/EmailOutlined';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import {emailRule, passportRule, userNameRule} from "@/pages/signup/formRules";

const inputStyle = {
  // marginTop: "20px",
  // width: "100%"
}

const Login: NextPage = () => {
  const router = useRouter();

  const [showPassport, setShowPassport] = useState({
    pass: false,
    confirmPass: false,
  })

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {control, handleSubmit, formState: {errors}, register, getValues} = useForm({
    defaultValues: {
      username: "",
      email: "",
      password: "",
      check_password: "",
    }
  });

  const onSubmit = (data) => {
    let {check_password, email, password, username: nickname} = data;

    signUpApi({
      check_password,
      email,
      password,
      nickname,
    }).then(res => {
      Message.success('Sign Up Success');
      gologin();
    })
  };

  const handleClickShowPassword = (key) => {
    setShowPassport({
      ...showPassport,
      [key]: !showPassport[key],
    });
  };


  function gologin() {
    router.push('/login')
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
        <div className={styles.title}>
          Sign up
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <Controller
            name="username"
            control={control}
            render={({field}) => (
              <TextField label="Name*"
                         sx={inputStyle}
                         size="small"
                         value={field.value}
                         fullWidth
                         onChange={field.onChange}
                         error={Boolean(get(errors, ['username', 'message']))}
                         helperText={get(errors, ['username', 'message'])}
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
                         sx={inputStyle}
                         size="small"
                         value={field.value}
                         onChange={field.onChange}
                         fullWidth
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
                         sx={inputStyle}
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
                                 {showPassport.pass ? <VisibilityOff/> : <Visibility/>}
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
                         sx={inputStyle}
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
                                 {showPassport.confirmPass ? <VisibilityOff/> : <Visibility/>}
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
          <div className={styles.btn} onClick={() => {
            router.push('/login')
          }}>
            Already have an account? <span onClick={gologin} className={styles.login}>Log In</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
