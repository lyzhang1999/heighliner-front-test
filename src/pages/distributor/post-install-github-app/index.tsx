/**
 * Used for redirect callback page after installed GitHub app.
 */

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { Alert, AlertTitle } from "@mui/material";

import PageCenter from "@/basicComponents/PageCenter";
import { TemporaryStorageItems } from "@/components/AddGitProvider/GitHubApp";
import { putInstallation, PutInstallationReq } from "@/api/github";
import CloseWindowCounter from "@/basicComponents/CloseWindowCounter";
import { Result } from "@/utils/constants";

enum ResultType {
  MissingInstallationId = "MissingInstallationId",
  StaleState = "StaleState",
  MissingOrgId = "MissingOrgId",
  Success = "Success",
}

export default function PostInstallGitHubApp(): React.ReactElement {
  const [resultType, setResultType] = useState<ResultType | null>();
  const router = useRouter();

  useEffect(() => {
    const installation_id = router.query.installation_id as string;
    const org_id = window.localStorage.getItem(
      TemporaryStorageItems.CurrentOrgID
    );
    const stateInURL = router.query.state as string;
    const stateInLocalStorage = window.localStorage.getItem(
      TemporaryStorageItems.GitHubInstallationState
    );

    switch (true) {
      case !installation_id:
        setResultType(ResultType.MissingInstallationId);
        return;
      case !org_id:
        setResultType(ResultType.MissingOrgId);
        return;
      case !stateInURL ||
        !stateInLocalStorage ||
        stateInURL !== stateInLocalStorage:
        setResultType(ResultType.StaleState);
        return;
    }

    const putInstallationReq: PutInstallationReq = {
      org_id: +org_id!,
      installation_id: installation_id,
    };

    putInstallation(putInstallationReq).then(() => {
      setResultType(ResultType.Success);
      
      // Indicate that add git provider successfully.
      window.localStorage.setItem(
        TemporaryStorageItems.SuccessAdd,
        Result.Success
      );
    });
  }, [router]);

  return (
    <PageCenter>
      <>
        {resultType === ResultType.MissingInstallationId && (
          <Alert severity="error">
            <AlertTitle>
              Can&apos;t find your installation information.
            </AlertTitle>
            Please make sure you have installed the GitHub app.
          </Alert>
        )}
        {resultType === ResultType.StaleState && (
          <Alert severity="error">
            <AlertTitle>Unknown request.</AlertTitle>
            Please try again.
          </Alert>
        )}
        {resultType === ResultType.MissingOrgId && (
          <Alert severity="error">
            <AlertTitle>Can&apos;t find your Organization.</AlertTitle>
            Please return to the origin window, login to your account, and try
            again.
          </Alert>
        )}
        {resultType === ResultType.Success && (
          <Alert>
            <AlertTitle>
              The app {process.env.NEXT_PUBLIC_GTIHUB_APP_NAME} has install to
              your organization successfully.
            </AlertTitle>
            The window will automatically closed after{" "}
            <CloseWindowCounter seconds={3000} /> second.
          </Alert>
        )}
      </>
    </PageCenter>
  );
}
