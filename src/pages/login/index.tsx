import {useContext, useState} from "react";
import {NextPage} from "next";
import clsx from "clsx";
import {LoadingButton} from "@mui/lab";
import GitHubIcon from "@mui/icons-material/GitHub";
import {Card, Typography, Box} from "@mui/material";
import {useRouter} from "next/router";

import {getPopUpsWindowFeatures} from "@/utils/window";
import {TokenAction, useTokenContext} from "@/hooks/token";

import styles from "./index.module.scss";
import Image from "next/image";
import {Context} from "@/utils/store";
import http from "@/utils/axios";

const Login: NextPage = () => {
  const [logining, setLogining] = useState(false);
  const {token, dispatchToken} = useTokenContext();
  const {dispatch} = useContext(Context);
  const router = useRouter();

  function getOriList() {
    http.get('/orgs').then((res: any[]) => {
      dispatch({organizationList: res});
      if (res.length) {
        let oriName = res[0].id;
        router.push(`${oriName}/applications`);
      }
    })
  }

  const handleGitHubLogin = () => {
    dispatchToken({type: TokenAction.Remove});

    const url = new URL(process.env.NEXT_PUBLIC_GITHUB_URL!);
    // Using in url request to github to prevent from forgery attack
    const state = window.crypto.randomUUID();
    window.localStorage.setItem("state", state);
    url.searchParams.set("state", state);
    url.searchParams.set('redirect_uri',  location.origin + "/login/github")

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
        getOriList();
      }
    }, 1000);
  };

  return (
    <div className={clsx("relative", styles.container)}>
      <div className={clsx("absolute flex gap-4", styles.logo)}>
        <Image
          src="/img/logo/header-logo.webp"
          alt="Heighliner"
          width={51}
          height={33}
        />
        <Image src="/img/logo/white-heighliner.svg" alt="Heighliner" width={111.3} height={23.5}/>
      </div>
      <Card
        className={clsx(
          "flex flex-col justify-center rounded-none absolute",
          styles.card
        )}
      >
        <Box className="flex flex-col justify-center gap-4">
          <Typography
            variant="h4"
            className={clsx("flex justify-center", styles.title)}
          >
            Sign in to Your Account
          </Typography>
          <Box className="flex justify-center">
            <LoadingButton
              loading={logining}
              className={clsx("normal-case", styles.githubLoginBtn)}
              variant="outlined"
              startIcon={<GitHubIcon className="text-4xl m-1"/>}
              loadingPosition="start"
              size="large"
              onClick={handleGitHubLogin}
            >
              Log in with GitHub
            </LoadingButton>
          </Box>
        </Box>
      </Card>
    </div>
  );
};

export default Login;
