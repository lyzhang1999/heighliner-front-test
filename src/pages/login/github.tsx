import { NextPage } from "next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

import PageCenter from "@/components/PageCenter";
import { Alert, CircularProgress } from "@mui/material";

import NextLogin from "./components/NextLogin";

enum Result {
  Loading,
  Denied,
  InvalidURL,
  GetCodeSuccess,
}

const GitHub: NextPage = () => {
  const [result, setResult] = useState(Result.Loading);
  const router = useRouter();
  const { code, error, state: stateInURL } = router.query;
  
  useEffect(() => {
    const stateInLocalStorage = window.localStorage.getItem('state');
    if(stateInLocalStorage !== stateInURL) {
      setResult(Result.InvalidURL);
    } else if(error === 'access_denied') {
      setResult(Result.Denied);
    } else if(code) {
      setResult(Result.GetCodeSuccess);
    }
  }, [code, error, stateInURL])

  switch (result) {
    case Result.Denied:
      return (
        <PageCenter>
          <Alert severity="warning">Access Deined</Alert>
        </PageCenter>
      );
    case Result.InvalidURL:
      return (
        <PageCenter>
          <Alert severity="error">Invalid Request</Alert>
        </PageCenter>
      );
    case Result.GetCodeSuccess:
      return (
        <PageCenter>
          <NextLogin code={code as string}></NextLogin>
        </PageCenter>
      );
    default:
      return (
        <PageCenter>
          <CircularProgress />
        </PageCenter>
      );
  }
};

export default GitHub;
