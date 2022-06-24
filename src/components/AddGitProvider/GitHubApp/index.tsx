import { Button, Stack } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { getPopUpsWindowFeatures } from "@/utils/window";
import { getOriIdByContext, uuid } from "@/utils/utils";
import GlobalLoading from "@/basicComponents/GlobalLoading";
import { Result } from "@/utils/constants";

interface Props {
  setModalDisplay: Dispatch<SetStateAction<boolean>>;
}

export enum TemporaryStorageItems {
  GitHubInstallationState = "GitHubInstallationState",
  CurrentOrgID = "CurrentOrgID",
  SuccessAdd = "SuccessAdd",
}

export default function GitHubApp(props: Props): React.ReactElement {
  const [openGlobalLoading, setOpenGlobalLoading] = useState(false);

  const openGitHubAppInstallationWindow = () => {
    setOpenGlobalLoading(true);

    const url = new URL(process.env.NEXT_PUBLIC_GITHUB_APP_INSTALLATION!);

    // Attach to URL to protect from forge URL.
    const state = uuid();
    url.searchParams.set("state", state);

    window.localStorage.setItem(
      TemporaryStorageItems.GitHubInstallationState,
      state
    );
    window.localStorage.setItem(
      TemporaryStorageItems.CurrentOrgID,
      getOriIdByContext()
    );

    // Open a new window to install GitHub app.
    const GitHubAppInstallationWindow = window.open(
      url,
      "Installing Forkmain",
      getPopUpsWindowFeatures()
    );

    // Polling the window whether or not has closed.
    const timer = setInterval(function polling() {
      if (GitHubAppInstallationWindow!.closed) {
        setOpenGlobalLoading(false);

        // If add  new git provider successfully, that close the drawer.
        if (
          window.localStorage.getItem(TemporaryStorageItems.SuccessAdd) ===
          Result.Success
        ) {
          props.setModalDisplay(false);
        }

        window.localStorage.removeItem(
          TemporaryStorageItems.GitHubInstallationState
        );
        window.localStorage.removeItem(TemporaryStorageItems.CurrentOrgID);
        window.localStorage.removeItem(TemporaryStorageItems.SuccessAdd);

        clearInterval(timer);
      }
    }, 1000);
  };

  return (
    <>
      <Stack
        style={{ height: "50vh" }}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Button onClick={openGitHubAppInstallationWindow} variant="outlined">
          <AddCircleOutlineIcon />
          &nbsp;Add a new organization
        </Button>
      </Stack>
      <GlobalLoading
        {...{
          openGlobalLoading,
          setOpenGlobalLoading,
          title: "Processing",
          description:
            `Please choose a organization to ` +
            `install ${process.env.NEXT_PUBLIC_GTIHUB_APP_NAME} app`,
        }}
      />
    </>
  );
}
