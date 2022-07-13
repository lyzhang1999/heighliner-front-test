import React, { useState } from "react";
import { Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { uuid } from "@/utils/utils";
import { getPopUpsWindowFeatures } from "@/utils/window";
import GlobalLoading from "@/basicComponents/GlobalLoading";
import useRedirectCurrentOrganization from "@/hooks/redirectCurrentOrganization";

export enum GitHub_TemporaryStorageItems {
  State = "GITHUB_STATE",
}

export default function GitHub(): React.ReactElement {
  const url = new URL(process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_LOGIN_URL!);
  const [openGlobalLoading, setOpenGlobalLoading] = useState(false);
  const redirectCurrentOrganization = useRedirectCurrentOrganization();

  const openGitHubAuthorization = () => {
    // Attach to URL to protect from forge URL.
    const state = uuid();
    url.searchParams.set("state", state);
    url.searchParams.set(
      "redirect_uri",
      location.origin + "/distributor/post-auth-github"
    );
    window.localStorage.setItem(GitHub_TemporaryStorageItems.State, state);

    setOpenGlobalLoading(true);
    const GitHubLoginWindow = window.open(
      url,
      "GitHub Authorization",
      getPopUpsWindowFeatures()
    );

    // Polling the window whether or not has closed
    const timer = setInterval(function polling() {
      if (GitHubLoginWindow!.closed) {
        clearInterval(timer);
        window.localStorage.removeItem("state");
        setOpenGlobalLoading(false);
        redirectCurrentOrganization();
      }
    }, 1000);
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<GitHubIcon />}
        sx={{
          width: "100%",
        }}
        onClick={openGitHubAuthorization}
      >
        sign in with GitHub
      </Button>
      <GlobalLoading {...{ 
        openGlobalLoading,
        title: "Please approval authentication to ForkMain in GitHub."
        }} />
    </>
  );
}
