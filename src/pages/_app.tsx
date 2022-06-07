import {useEffect, useReducer} from "react";
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {useRouter} from "next/router";

import {useTokenReducer} from '@/hooks/token';
import {initState, Context, reducer} from "@/utils/store";
import {ThemeProvider} from '@mui/material/styles';

import '@/styles/globals.scss';
import cookie from "@/utils/cookie";
import http from "@/utils/axios";
import Notice from '@/components/Notice/index';
import {judgeCurrentOri} from "@/utils/utils";
import theme from "@/utils/theme";
import {AxiosResponse} from "axios";
import {getOrgList} from "@/utils/api/org";

const noCheckOriPage = ['/login/github'];

function App({Component, pageProps}: AppProps) {
  const [token, dispatchToken] = useTokenReducer();
  const [state, dispatch] = useReducer(reducer, initState);
  const router = useRouter();

  useEffect(() => {
    loginCheck();
  }, [])

  function loginCheck() {
    const token = cookie.getCookie('token');
    if (!noCheckOriPage.includes(router.pathname)) {
      if (token) {
        getOrgList().then(res => {
          dispatch({organizationList: res});
          let oriId = res[0]?.id;
          if (res.length && (["/", '/login'].includes(router.pathname))) {
            router.push(`${oriId}/applications`);
          } else {
            if (!judgeCurrentOri(res)) {
              location.pathname = `${oriId}/applications`;
            }
          }
        })
      } else {
        router.push("/login");
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Heighliner Platform · Speed up Cloud Native Application Development</title>
        <meta name="description" content="Heighliner Cloud · Speed up Cloud Native Application Development"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico"/>
      </Head>
      <ThemeProvider theme={theme}>
        <Context.Provider value={{state, dispatch}}>
          <Notice/>
          <Component {...pageProps} />
        </Context.Provider>
      </ThemeProvider>
    </div>
  )
}

export default App;
