import {useContext, useState} from "react";
import {NextPage} from "next";
import clsx from "clsx";
import {LoadingButton} from "@mui/lab";
import GitHubIcon from "@mui/icons-material/GitHub";
import {Box, Divider, TextField} from "@mui/material";
import {useRouter} from "next/router";

import {getPopUpsWindowFeatures} from "@/utils/window";
import {trim} from "lodash-es";

import styles from "./index.module.scss";
import Image from "next/image";
import {Context} from "@/utils/store";
import http from "@/utils/axios";
import {setLoginToken, uuid} from "@/utils/utils";
import {NoticeRef} from "@/components/Notice";
import {login, LoginType, Res} from "@/utils/api/login";
import {getOrgList} from "@/utils/api/org";
import LoadingPoint from "@/pages/login/loadingBtn";

const inputStyle = {
  marginTop: "6px",
  width: "100%"
}

const Login: NextPage = () => {
  const [logining, setLogining] = useState(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const {dispatch} = useContext(Context);
  const router = useRouter();

  function oriList() {
    getOrgList().then(res => {
      dispatch({
        organizationList: res,
        currentOiganization: {...res[0], ...res[0].member}
      });
      let oriName = encodeURIComponent(res[0]?.name);
      router.push(`${oriName}/applications`);
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
        oriList();
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
    setLoginLoading(true);
    login({logintype: LoginType.ACCOUNT, user, pass}).then((res) => {
      setLoginToken(res.token)
      oriList();
    }).catch(err => {
      setLoginLoading(false);
    })
  }

  function goSignup() {
    router.push('/signup')
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
        {/*<Box className="flex justify-center">*/}
        {/*  <LoadingButton*/}
        {/*    loading={logining}*/}
        {/*    className={clsx("normal-case", styles.githubLoginBtn)}*/}
        {/*    variant="outlined"*/}
        {/*    startIcon={<GitHubIcon className="text-4xl m-1"/>}*/}
        {/*    loadingPosition="start"*/}
        {/*    size="large"*/}
        {/*    onClick={handleGitHubLogin}*/}
        {/*  >*/}
        {/*    Log in with GitHub*/}
        {/*  </LoadingButton>*/}
        {/*</Box>*/}
        {/*<div className={styles.divider}>*/}
        {/*  <Divider>or</Divider>*/}
        {/*</div>*/}

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
        <div className={styles.action}>
          <div className={styles.btn}>
            {/*Forgot Password*/}
          </div>
          <div className={styles.btn} onClick={goSignup}>
            Sign up
          </div>
        </div>
        <div className={styles.signIn} onClick={passwordLogin}>
          Sign In {loginLoading && <LoadingPoint/>}
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
