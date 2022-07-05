import styles from '@/components/PageWrapper/index.module.scss';
import {Controller, useForm} from "react-hook-form";
import {IconButton, InputAdornment, TextField} from "@mui/material";
import {get} from "lodash-es";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {emailRule, passportRule} from "@/pages/signup/formRules";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {Visibility, VisibilityOff} from "@mui/icons-material";
import {useState} from "react";
import PageWrapper from "@/components/PageWrapper";

const inputStyle = {
  marginTop: "20px",
  // width: "100%"
}

export default function ForgotPassword() {

  const [showPassport, setShowPassport] = useState({
    pass: false,
    confirmPass: false,
  })

  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const {control, handleSubmit, formState: {errors}, register, getValues} = useForm({
    defaultValues: {
      password: "",
      check_password: "",
    }
  });

  const handleClickShowPassword = (key) => {
    setShowPassport({
      ...showPassport,
      [key]: !showPassport[key],
    });
  };


  function onSubmit() {

  }

  return (
    <PageWrapper
      title="Reset Password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

        <Controller
          name="password"
          control={control}
          render={({field}) => (
            <TextField label="Password*"
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
                       size="small"
                       fullWidth
                       sx={inputStyle}
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
        {/*<div className={styles.desc}>Hongchao is invating you to join H8r in ForkMain.</div>*/}
        <input className={styles.btn} type="submit" value="Send reset link"/>
      </form>

    </PageWrapper>
  )
}
