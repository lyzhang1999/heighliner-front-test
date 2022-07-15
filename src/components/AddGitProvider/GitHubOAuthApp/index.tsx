import { Button, Stack } from "@mui/material";
import React, { Dispatch, SetStateAction, useState } from "react";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { getPopUpsWindowFeatures } from "@/utils/window";
import {getOriIdByContext, isProduct, uuid} from "@/utils/utils";
import GlobalLoading from "@/basicComponents/GlobalLoading";
import {
  GitHubOAuthAppTemporaryStorage,
  openGitHubOAuthWindow,
  PostAuthAction,
} from "@/pages/distributor/post-auth-github";

import { AddGitProviderSuccessCb } from "..";
import { CreateGitProviderRes } from "@/api/gitProviders";

interface Props {
  setModalDisplay: Dispatch<SetStateAction<boolean>>;
  successCb?: AddGitProviderSuccessCb;
}

export default function GitHubOAuthApp(props: Props): React.ReactElement {
  const [openGlobalLoading, setOpenGlobalLoading] = useState(false);

  const clickHandler = () => {
    window.localStorage.setItem(
      GitHubOAuthAppTemporaryStorage.postAuthAction,
      PostAuthAction.AddGitProvider
    );

    let domain: string = isProduct() ? process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_REPO_URL_PROD! : process.env.NEXT_PUBLIC_GITHUB_OAUTH_APP_REPO_URL!;

    openGitHubOAuthWindow(
      new URL(domain),
      setOpenGlobalLoading,
      function successCb() {
        props.setModalDisplay(false);

        // Get the createGitProvideRes and execute the successCb.
        const rowCreateGitProvideRes = window.localStorage.getItem(
          GitHubOAuthAppTemporaryStorage.createGitProviderRes
        );
        window.localStorage.removeItem(
          GitHubOAuthAppTemporaryStorage.createGitProviderRes
        );
        const createGitProvideRes = rowCreateGitProvideRes
          ? JSON.parse(rowCreateGitProvideRes)
          : {};
        props.successCb && props.successCb(createGitProvideRes);
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
