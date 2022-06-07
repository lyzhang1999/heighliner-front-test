import {useEffect, useState} from "react";
import {Alert, AlertTitle, LinearProgress} from "@mui/material";
import {Result} from "@/utils/constants";
import {login, LoginType} from '@/utils/api/login';
import {setLoginToken} from "@/utils/utils";
import CloseWindowCounter from "./CloseWindowCounter";

interface Props {
  code: string;
}

export default function NextLogin({code}: Props) {
  const [result, setResult] = useState(Result.Loading);

  useEffect(() => {
    login({logintype: LoginType.GITHUB, code}).then((res) => {
      setLoginToken(res.token)
      setResult(Result.Success);
    })
  }, [])

  switch (result) {
    case Result.Error:
      return (
        <Alert severity="error">
          <AlertTitle>Network Error</AlertTitle>
          Please try again.
        </Alert>
      );
    case Result.Success:
      return (
        <Alert severity="success">
          <AlertTitle>Login Successfully</AlertTitle>
          The window will automatically closed after <CloseWindowCounter seconds={3}/> second.
        </Alert>
      );
    default:
      return <LinearProgress color="secondary"/>;
  }
}
