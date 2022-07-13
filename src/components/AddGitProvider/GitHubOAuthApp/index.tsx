import { Button, Stack } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { getPopUpsWindowFeatures } from "@/utils/window";
import { getOriIdByContext, uuid } from "@/utils/utils";
import GlobalLoading from "@/basicComponents/GlobalLoading";
import {
  GitHubOAuthAppTemporaryStorage,
  openGitHubOAuthWindow,
  Result,
} from "@/pages/distributor/post-auth-github";

interface Props {
  setModalDisplay: Dispatch<SetStateAction<boolean>>;
}

export default function GitHubOAuthApp(props: Props): React.ReactElement {
  const [openGlobalLoading, setOpenGlobalLoading] = useState(false);

  const clickHandler = () => {
    openGitHubOAuthWindow(
      new URL(process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_REPO_URL as string),
      setOpenGlobalLoading,
      function successCb() {
        props.setModalDisplay(false);
      }
    );
  };

  return (
    <>
      <Stack
        style={{ height: "10vh" }}
        direction="row"
        justifyContent="center"
        alignItems="center"
      >
        <Button onClick={clickHandler} variant="outlined">
          <AddCircleOutlineIcon />
          &nbsp;Add
        </Button>
      </Stack>
      <GlobalLoading
        {...{
          openGlobalLoading,
          title: "Processing",
          description: `Please approval authentication to in GitHub`,
        }}
      />
    </>
  );
}
