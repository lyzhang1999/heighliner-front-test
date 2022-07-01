import {useContext, useState} from "react";
import {NextPage} from "next";
import clsx from "clsx";
import {TextField} from "@mui/material";
import {useRouter} from "next/router";

import {getPopUpsWindowFeatures} from "@/utils/window";
import {omit, trim} from "lodash-es";

import styles from "./index.module.scss";
import Image from "next/image";
import {Context} from "@/utils/store";
import {Message, setLoginToken, uuid} from "@/utils/utils";
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
      let list = res.data;
      dispatch({
        organizationList: list,
        currentOrganization: omit({...list[0], ...list[0].member}, 'member')
      });
      let oriName = encodeURIComponent(list[0]?.name);
      router.push(`${oriName}/applications`);
    })
  }

  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  function passwordLogin() {
    let user = trim(username);
    let pass = trim(password);
    if (!user) {
      Message.error("Please input User Name");
      return;
    }
    if (!pass) {
      Message.error("Please input password");
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
          alt="ForkMain"
          width={51}
          height={33}
        />
        <Image src="/img/logo/white-heighliner.svg" alt="Heighliner" width={111.3} height={23.5}/>
      </div>
      <div className={styles.cardWrapper}>
        <div className={styles.title}>
          Sign in to Your Account
        </div>
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
                   onKeyPress={(e) => {
                     if (e.charCode === 13) {
                       passwordLogin();
                     }
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
      </div>
    </div>
  );
};

export default Login;
