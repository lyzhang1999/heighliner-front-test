import {useContext, useState} from "react";
import {NextPage} from "next";
import clsx from "clsx";
import {LoadingButton} from "@mui/lab";
import GitHubIcon from "@mui/icons-material/GitHub";
import {Card, Typography, Box, Divider, TextField} from "@mui/material";
import {useRouter} from "next/router";

import {getPopUpsWindowFeatures} from "@/utils/window";
import {TokenAction, useTokenContext} from "@/hooks/token";
import {trim} from "lodash-es";
import cookie from "@/utils/cookie";

import styles from "./index.module.scss";
import Image from "next/image";
import {Context} from "@/utils/store";
import http from "@/utils/axios";
import {getOriginzationByUrl, uuid} from "@/utils/utils";
import {NoticeRef} from "@/components/Notice";

const inputStyle = {
  marginTop: "6px",
  width: "100%"
}

const Login: NextPage = () => {
  const [logining, setLogining] = useState(false);
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
    const url = new URL(process.env.NEXT_PUBLIC_GITHUB_URL!);
    // Using in url request to github to prevent from forgery attack
    const state = uuid();
    window.localStorage.setItem("state", state);
    url.searchParams.set("state", state);
    url.searchParams.set('redirect_uri', location.origin + "/login/github")

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


  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function passwordLogin() {
    let user = trim(username);
    let pass = trim(password);
    if (!user) {
      NoticeRef.current?.open({
        message: "Please input User Name",
        type: "error",
      });
      return;
    }
    if (!pass) {
      NoticeRef.current?.open({
        message: "Please input password",
        type: "error",
      });
      return;
    }
    http.get(`/auth/token?login_type=account&username=${user}&password=${pass}`,).then(res => {
      let {token} = res;
      cookie.setCookie('token', token, 1000 * 60 * 60 * 48); // 48h
      getOriList();
    })
  }


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


      <div className={styles.cardWrapper}>
        <div className={styles.title}>
          Sign in to Your Account
        </div>
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
        <div className={styles.divider}>
          <Divider>or</Divider>
        </div>

        {/*<div className={styles.inputTitle}>*/}
        {/*  User*/}
        {/*  <input type="text"/>*/}
        {/*</div>*/}

        {/*<div className={styles.inputTitle}>*/}
        {/*  User*/}
        {/*</div>*/}

        <TextField id="standard-basic" label="User" variant="standard" sx={inputStyle}
                   value={username}
                   onChange={(e) => {
                     setUsername(e.target.value)
                   }}
        />

        <TextField id="standard-basic" label="Password" variant="standard"
                   type="password"
                   sx={inputStyle}
                   value={password}
                   onChange={(e) => {
                     setPassword(e.target.value)
                   }}
        />
        {/*<div className={styles.action}>*/}
        {/*  <div className={styles.btn}>*/}
        {/*    Forgot your Password?*/}
        {/*  </div>*/}
        {/*  <div className={styles.btn}>*/}
        {/*    Need an Account?*/}
        {/*  </div>*/}
        {/*</div>*/}
        <div className={styles.signIn} onClick={passwordLogin}>
          Sign In
        </div>
        {/*<div className={styles.centerLine}>*/}
        {/*  /!*<div className={styles.line}></div>*!/*/}
        {/*  or*/}
        {/*</div>*/}
      </div>

      {/*<Card*/}
      {/*  className={clsx(*/}
      {/*    "flex flex-col justify-center rounded-none absolute",*/}
      {/*    styles.card*/}
      {/*  )}*/}
      {/*>*/}
      {/*  <Box className="flex flex-col justify-center gap-4">*/}
      {/*    <Typography*/}
      {/*      variant="h4"*/}
      {/*      className={clsx("flex justify-center", styles.title)}*/}
      {/*    >*/}
      {/*      Sign in to Your Account*/}
      {/*    </Typography>*/}
      {/*    <Box className="flex justify-center">*/}
      {/*      <LoadingButton*/}
      {/*        loading={logining}*/}
      {/*        className={clsx("normal-case", styles.githubLoginBtn)}*/}
      {/*        variant="outlined"*/}
      {/*        startIcon={<GitHubIcon className="text-4xl m-1"/>}*/}
      {/*        loadingPosition="start"*/}
      {/*        size="large"*/}
      {/*        onClick={handleGitHubLogin}*/}
      {/*      >*/}
      {/*        Log in with GitHub*/}
      {/*      </LoadingButton>*/}
      {/*    </Box>*/}
      {/*  </Box>*/}
      {/*</Card>*/}
    </div>
  );
};

export default Login;
