import React, { Dispatch, SetStateAction, useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Alert, AlertTitle, CircularProgress } from "@mui/material";

import { getAuthToken, GetAuthTokenReq, LoginType } from "@/api/auth";
import CloseWindowCounter from "@/basicComponents/CloseWindowCounter";
import PageCenter from "@/basicComponents/PageCenter";
import { setLoginToken, uuid } from "@/utils/utils";
import { getPopUpsWindowFeatures } from "@/utils/window";

export enum Result {
  Processing = "Processing",
  Access_Denied = "access_denied",
  StaleState = "StaleState",
  Success = "Success",
  Error = "Error",
}

export enum GitHubOAuthAppTemporaryStorage {
  state = "github_oauth_app_state",
  success = "github_oauth_app_success",
  postAuthAction = "post_auth_action",
}

export enum PostAuthAction {
  SignIn = "SignIn",
  AddGitProvider = "AddGitProvider",
}

export const openGitHubOAuthWindow = (
  url: URL,
  setOpenGlobalLoading: Dispatch<SetStateAction<boolean>>,
  successCb?: Function
) => {
  setOpenGlobalLoading(true);

  // Attach to URL to protect from forge URL.
  const state = uuid();
  url.searchParams.set("state", state);

  window.localStorage.setItem(GitHubOAuthAppTemporaryStorage.state, state);
  window.localStorage.removeItem(GitHubOAuthAppTemporaryStorage.success);

  // Open a new window to authenticate GitHub app.
  const GitHubAppInstallationWindow = window.open(
    url,
    "Authenticate ForkMain",
    getPopUpsWindowFeatures()
  );

  // Polling the window whether or not has closed.
  const timer = setInterval(function polling() {
    if (GitHubAppInstallationWindow!.closed) {
      setOpenGlobalLoading(false);

      if (
        window.localStorage.getItem(GitHubOAuthAppTemporaryStorage.success) ===
        Result.Success
      ) {
        successCb && successCb();
      }

      window.localStorage.removeItem(GitHubOAuthAppTemporaryStorage.state);
      window.localStorage.removeItem(GitHubOAuthAppTemporaryStorage.success);

      clearInterval(timer);
    }
  }, 1000);
};

export default function PostAuthGitHub(): React.ReactElement {
  const [result, setResult] = useState<Result>();
  const router = useRouter();

  useEffect(() => {
    const { error, state: stateInURL, code } = router.query;

    const stateInLocalStorage = window.localStorage.getItem(
      GitHubOAuthAppTemporaryStorage.state
    );

    const postAuthAction = window.localStorage.getItem(
      GitHubOAuthAppTemporaryStorage.postAuthAction
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
    const req: GetAuthTokenReq = {
      login_type: LoginType.GitHub,
      code: code,
    };

    getAuthToken(req)
      .then((res) => {
        setLoginToken(res.token, res.expire_in);
        setResult(Result.Success);
        // Add success indicator
        window.localStorage.setItem(
          GitHubOAuthAppTemporaryStorage.success,
          Result.Success
        );
      })
      .catch((error) => {
        console.error(error);
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
            <AlertTitle>You have authenticated successfully.</AlertTitle>
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
