import React, {useState} from "react";
import {Button} from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";

import GlobalLoading from "@/basicComponents/GlobalLoading";
import useRedirectCurrentOrganization from "@/hooks/redirectCurrentOrganization";
import {
  GitHubOAuthAppTemporaryStorage,
  openGitHubOAuthWindow,
  PostAuthAction,
} from "@/pages/distributor/post-auth-github";
import {isProduct} from "@/utils/utils";
import {deleteToken} from "@/utils/token";

export enum GitHub_TemporaryStorageItems {
  State = "GITHUB_STATE",
}

export default function GitHub(): React.ReactElement {
  const [openGlobalLoading, setOpenGlobalLoading] = useState(false);
  const redirectCurrentOrganization = useRedirectCurrentOrganization();

  const clickHandler = () => {
    deleteToken()
    window.localStorage.setItem(
      GitHubOAuthAppTemporaryStorage.postAuthAction,
      PostAuthAction.SignIn
    );

    let domain: string = isProduct() ? process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_LOGIN_URL_PROD! : process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_LOGIN_URL!;

    openGitHubOAuthWindow(
      new URL(domain),
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
