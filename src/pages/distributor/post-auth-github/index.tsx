import {
  createGitProvider,
  CreateGitProviderReq,
  GitProvider,
  GitProviderType,
} from "@/api/gitProviders";
import CloseWindowCounter from "@/basicComponents/CloseWindowCounter";
import PageCenter from "@/basicComponents/PageCenter";
import { GitHub_TemporaryStorageItems } from "@/components/sign-in/GitHub.tsx";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

enum Result {
  Processing = "Processing",
  Access_Denied = "access_denied",
  StaleState = "StaleState",
  Success = "Success",
  Error = "Error",
}

export default function PostAuthGitHub(): React.ReactElement {
  const [result, setResult] = useState<Result>();
  const router = useRouter();

  useEffect(() => {
    const { error, state: stateInURL, code } = router.query;

    const stateInLocalStorage = window.localStorage.getItem(
      GitHub_TemporaryStorageItems.State
    );

    switch (true) {
      case error === Result.Access_Denied:
        setResult(Result.Access_Denied);
        break;
      case stateInLocalStorage &&
        stateInURL &&
        stateInLocalStorage !== stateInURL:
        setResult(Result.StaleState);
        break;
      case code !== undefined:
        setResult(Result.Processing);
        auth(code as string);
        break;
      default:
        setResult(Result.Processing);
        break;
    }
  }, [router.query]);

  const auth = (code: string) => {
    const req: CreateGitProviderReq = {
      provider: GitProvider.GitHub,
      type: GitProviderType.GitHubOAuth,
      code,
    };
    createGitProvider(req)
      .then(() => {
        setResult(Result.Success);
      })
      .catch(() => {
        setResult(Result.Error);
      });
  };

  return (
    <PageCenter>
      <>
        {result === Result.Processing && <CircularProgress />}
        {result === Result.StaleState && (
          <Alert severity="error">
            <AlertTitle>Unknown request.</AlertTitle>
            Please try again.
          </Alert>
        )}
        {result === Result.Access_Denied && (
          <Alert severity="error">
            <AlertTitle>Access Denied</AlertTitle>
            Please authorize {process.env.NEXT_PUBLIC_GTIHUB_APP_NAME}.
          </Alert>
        )}
        {result === Result.Success && (
          <Alert>
            <AlertTitle>
              You have authenticated successfully.
            </AlertTitle>
            The window will automatically closed after{" "}
            <CloseWindowCounter seconds={30000} /> second.
          </Alert>
        )}
        {result === Result.Error && (
          <Alert severity="error">
            <AlertTitle>Network Error</AlertTitle>
            Please try again.
          </Alert>
        )}
      </>
    </PageCenter>
  );
}
