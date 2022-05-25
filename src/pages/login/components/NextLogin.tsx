import { useEffect, useState } from "react";
import { Alert, AlertTitle, LinearProgress } from "@mui/material";

import { TokenAction, useTokenContext } from "@/hooks/token";
import { Result } from "@/utils/constants";
import { useApi } from "@/utils/http";

import CloseWindowCounter from "./CloseWindowCounter";

interface Props {
  code: string;
}

export default function NextLogin({ code }: Props) {
  const { token, dispatchToken } = useTokenContext();
  const [result, setResult] = useState(Result.Loading);

  const { data, error } = useApi(
    "/user/login?" +
      new URLSearchParams({
        code: code,
      })
  );

  useEffect(() => {
    if (error) {
      setResult(Result.Error);
    } else if (!data) {
      setResult(Result.Loading);
    } else if (data) {
      setResult(Result.Success);
      dispatchToken({
        type: TokenAction.Set,
        payload: { token: data.token },
      });
    }
  }, [error, data, dispatchToken]);

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
          The window will automatically closed after <CloseWindowCounter seconds={3} /> second.
        </Alert>
      );
    default:
      return <LinearProgress color="secondary" />;
  }
}
