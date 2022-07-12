import React, { useState } from "react";
import { Button } from "@mui/material";
import GitHubIcon from "@mui/icons-material/GitHub";
import { uuid } from "@/utils/utils";
import { getPopUpsWindowFeatures } from "@/utils/window";
import GlobalLoading from "@/basicComponents/GlobalLoading";

export enum GitHub_TemporaryStorageItems {
  State = "GITHUB_STATE",
}

export default function GitHub(): React.ReactElement {
  const url = new URL(process.env.NEXT_PUBLIC_GITHUB_URL!);
  const [openGlobalLoading, setOpenGlobalLoading] = useState(false);

  const openGitHubAuthorization = () => {
    // Attach to URL to protect from forge URL.
    const state = uuid();
    url.searchParams.set("state", state);
    url.searchParams.set(
      "redirect_uri",
      location.origin + "/distributor/post-auth-github"
    );
    window.localStorage.setItem(GitHub_TemporaryStorageItems.State, state);

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
        // oriList();
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
      <GlobalLoading {...{ openGlobalLoading }} />
    </>
  );
}
