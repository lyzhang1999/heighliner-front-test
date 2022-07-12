import CloseWindowCounter from "@/basicComponents/CloseWindowCounter";
import PageCenter from "@/basicComponents/PageCenter";
import { GitHub_TemporaryStorageItems } from "@/components/sign-in/GitHub.tsx";
import { Alert, AlertTitle } from "@mui/material";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";

enum Result {
  Access_Denied = "access_denied",
  StaleState = "StaleState",
  Success = "Success",
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
      case stateInLocalStorage !== stateInURL:
        setResult(Result.StaleState);
        break;
      case error === Result.Access_Denied:
        setResult(Result.Access_Denied);
        break;
    }
  }, [router.query]);

  return (
    <PageCenter>
      <>
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
              The app {process.env.NEXT_PUBLIC_GTIHUB_APP_NAME} has install to
              your organization successfully.
            </AlertTitle>
            The window will automatically closed after{" "}
            <CloseWindowCounter seconds={30000} /> second.
          </Alert>
        )}
      </>
    </PageCenter>
  );
}
