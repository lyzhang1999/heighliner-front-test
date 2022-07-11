import styles from '@/components/PageWrapper/index.module.scss';
import {Controller, useForm} from "react-hook-form";
import {InputAdornment, TextField} from "@mui/material";
import {get} from "lodash-es";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import {emailRule} from "@/pages/sign-up/formRules";
import PageWrapper from "@/components/PageWrapper";

export default function ForgotPassword() {

  const {control, handleSubmit, formState: {errors}, register, getValues} = useForm({
    defaultValues: {
      email: "",
    }
  });

  function onSubmit() {

  }

  return (
    <PageWrapper
      title="Reset Password"
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>

        <Controller
          name="email"
          control={control}
          render={({field}) => (
            <TextField label="Email*"
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
        <input className={styles.btn} type="submit" value="Send reset link"/>
      </form>
    </PageWrapper>
  )
}
