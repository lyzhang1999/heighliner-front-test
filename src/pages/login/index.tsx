import { useState } from "react";
import { NextPage } from "next";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import GitHubIcon from "@mui/icons-material/GitHub";
import { LoadingButton } from "@mui/lab";

import { getPopUpsWindowFeatures } from "@/utils/window";
import { TokenAction, useTokenContext } from "@/hooks/token";

const pages = ["About us", "Blog", "GitHub"];

const Login: NextPage = () => {
  const [logining, setLogining] = useState(false);
  const { token, dispatchToken } = useTokenContext();

  const handleGitHubLogin = () => {
    dispatchToken({ type: TokenAction.Remove });

    const url = new URL(process.env.NEXT_PUBLIC_GITHUB_URL!);
    // Using in url request to github to prevent from forgery attack
    const state = window.crypto.randomUUID();
    window.localStorage.setItem("state", state);
    url.searchParams.set("state", state);

    const GitHubLoginWindow = window.open(
      url,
      "GitHub Authorization",
      getPopUpsWindowFeatures()
    );

    setLogining(true);
    // Polling the window whether or not has closed
    const timer = setInterval(function polling() {
      if (GitHubLoginWindow!.closed) {
        clearInterval(timer);
        setLogining(false);
        window.localStorage.removeItem("state");

        // Redirect to the Dashboard page if exist token
        const token = window.localStorage.getItem("token");
        if (token) {
          location.href = process.env.NEXT_PUBLIC_DASHBOARD_URL as string;
        }
      }
    }, 1000);
  };

  return (
    <>
      <AppBar>
        <Toolbar>
          <Typography variant="h6" component="div" className="flex mr-2" noWrap>
            LOGO
          </Typography>
          <Box className="flex grow-1">
            {pages.map((page) => (
              <Button
                key={page}
                className="my-2 text-white block my-auto mx-2"
                variant="contained"
              >
                {page}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box className="flex flex-col justify-center gap-4 h-100vh">
        <Typography variant="h4" className="flex justify-center text-[#1976d2]">
          Make Application Faster!
        </Typography>
        <Box className="flex justify-center">
          <LoadingButton
            loading={logining}
            className="normal-case"
            variant="outlined"
            startIcon={<GitHubIcon className="text-4xl m-1" />}
            loadingPosition="start"
            size="large"
            onClick={handleGitHubLogin}
          >
            Log in with GitHub
          </LoadingButton>
        </Box>
      </Box>
    </>
  );
};

export default Login;
