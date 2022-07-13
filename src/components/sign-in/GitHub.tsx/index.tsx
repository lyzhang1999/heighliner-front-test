import React, { useState } from "react";
import { Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import GlobalLoading from "@/basicComponents/GlobalLoading";
import useRedirectCurrentOrganization from "@/hooks/redirectCurrentOrganization";
import {
  GitHubOAuthAppTemporaryStorage,
  openGitHubOAuthWindow,
  PostAuthAction,
} from "@/pages/distributor/post-auth-github";

export enum GitHub_TemporaryStorageItems {
  State = "GITHUB_STATE",
}

export default function GitHub(): React.ReactElement {
  const url = new URL(process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_LOGIN_URL!);
  const [openGlobalLoading, setOpenGlobalLoading] = useState(false);
  const redirectCurrentOrganization = useRedirectCurrentOrganization();

  const clickHandler = () => {
    window.localStorage.setItem(
      GitHubOAuthAppTemporaryStorage.postAuthAction,
      PostAuthAction.SignIn
    );

    openGitHubOAuthWindow(
      new URL(process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_LOGIN_URL as string),
      setOpenGlobalLoading,
      function successCb() {
        redirectCurrentOrganization();
      }
    );
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<GitHubIcon />}
        sx={{
          width: "100%",
        }}
        onClick={clickHandler}
      >
        sign in with GitHub
      </Button>
      <GlobalLoading
        {...{
          openGlobalLoading,
          title: "Please approval authentication to ForkMain in GitHub.",
        }}
      />
    </>
  );
}
