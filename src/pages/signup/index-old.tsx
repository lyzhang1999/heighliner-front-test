import {useState} from "react";
import {NextPage} from "next";
import clsx from "clsx";
import {TextField} from "@mui/material";
import {useRouter} from "next/router";

import styles from "../login/index.module.scss";
import Image from "next/image";
import {signUpApi} from "@/utils/api/login";
import {Message} from "@/utils/utils";
import {PassportReg} from "@/utils/config";
import {checkInput, checkAllParams, RuleItem, RuleKey} from './formUtil';

const inputStyle = {
  marginTop: "6px",
  width: "100%"
}

enum Key {
  "USERNAME" = "username",
  "PASSWORD" = "password",
  "CHECK_PASSWORD" = "check_password"
}

const formRule: RuleItem[] = [
  {
    key: Key.USERNAME,
    rule: [
      {[RuleKey.require]: true, msg: "username require"},
      {[RuleKey.max]: 20, msg: "the max length is 20"},
      {[RuleKey.min]: 5, msg: "the min length is 5"},
      {[RuleKey.reg]: /^[a-zA-Z0-9_-]{5,20}$/, msg: `contains only "_", "-", uppercase, lowercase and numbers`},
    ]
  },
  {
    key: Key.PASSWORD,
    rule: [
      {[RuleKey.require]: true, msg: "password require"},
      {[RuleKey.max]: 20, msg: "the max length is 20"},
      {[RuleKey.min]: 8, msg: "the min length is 8"},
      {
        [RuleKey.reg]: PassportReg,
        msg: "must contain uppercase, lowercase, and numbers"
      },
    ]
  },
  {
    key: Key.CHECK_PASSWORD,
    rule: [
      {[RuleKey.require]: true, msg: "confirm password require"},
      {[RuleKey.sameOther]: Key.PASSWORD, msg: 'the second same to first password'}
    ]
  }
]

const Login: NextPage = () => {
  const router = useRouter();

  const [inputValue, setInputValue] = useState({
    [Key.USERNAME]: '',
    [Key.PASSWORD]: '',
    [Key.CHECK_PASSWORD]: ''
  })
  const defaultError = useState({})

  function gologin() {
    router.push('/login')
  }

  function setValue(key: Key, value: string) {
    setInputValue({
      ...inputValue,
      [key]: value,
    })
  }

  function signUp() {
    let errMsg = checkAllParams(inputValue, formRule);
    if (errMsg) {
      Message.error('errMsg')
      return;
    }
    signUpApi(inputValue).then(res => {
      Message.success('Sign Up Success');
      gologin();
    })
  }

  return (
    <div className={clsx("relative", styles.container)}>
      {/*<div className={clsx("absolute flex gap-4", styles.logo)}>*/}
      {/*  <Image*/}
      {/*    src="/img/logo/header-logo.webp"*/}
      {/*    alt="ForkMain"*/}
      {/*    width={51}*/}
      {/*    height={33}*/}
      {/*  />*/}
      {/*  <Image src="/img/logo/white-heighliner.svg" alt="Heighliner" width={111.3} height={23.5}/>*/}
      {/*</div>*/}

      <div className={styles.cardWrapper}>
        <div className={styles.title}>
          Sign up
        </div>
        <TextField id="standard-basic" label="User" variant="standard" sx={inputStyle}
                   value={inputValue[Key.USERNAME]}
                   onChange={(e) => {
                     setValue(Key.USERNAME, e.target.value)
                   }}
                   error={Boolean(inputValue[Key.USERNAME] && checkInput(Key.USERNAME, inputValue, formRule))}
                   helperText={checkInput(Key.USERNAME, inputValue, formRule)}
        />
        <TextField id="standard-basic" label="Password" variant="standard"
                   type="password"
                   sx={inputStyle}
                   value={inputValue[Key.PASSWORD]}
                   onChange={(e) => {
                     setValue(Key.PASSWORD, e.target.value)
                   }}
                   error={Boolean(inputValue[Key.PASSWORD] && checkInput(Key.PASSWORD, inputValue, formRule))}
                   helperText={checkInput(Key.PASSWORD, inputValue, formRule)}
        />
        <TextField id="standard-basic" label="Confirm password twice" variant="standard"
                   type="password"
                   sx={inputStyle}
                   value={inputValue[Key.CHECK_PASSWORD]}
                   onChange={(e) => {
                     setValue(Key.CHECK_PASSWORD, e.target.value)
                   }}
                   error={Boolean(inputValue[Key.CHECK_PASSWORD] && checkInput(Key.CHECK_PASSWORD, inputValue, formRule))}
                   helperText={checkInput(Key.CHECK_PASSWORD, inputValue, formRule)}
                   onKeyPress={(e) => {
                     if (e.charCode === 13) {
                       signUp();
                     }
                   }}
        />

        <div className={styles.action}>
          <div className={styles.btn}>
            {/*Forgot Password*/}
          </div>
          <div className={styles.btn} onClick={() => {
            router.push('/login')
          }}>
            Has Accout, Go login
          </div>
        </div>
        <div className={styles.signIn} onClick={signUp}>
          Sign up
        </div>
      </div>
    </div>
  );
};

export default Login;
