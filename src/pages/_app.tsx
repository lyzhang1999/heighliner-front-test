import {useEffect, useReducer} from "react";
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {useRouter} from "next/router";

import {TokenContext, useTokenReducer} from '@/hooks/token';
import {initState, Context, reducer} from "@/utils/store";

import '@/styles/globals.scss';
import cookie from "@/utils/cookie";
import http from "@/utils/axios";

function App({Component, pageProps}: AppProps) {
  const [token, dispatchToken] = useTokenReducer();
  const [state, dispatch] = useReducer(reducer, initState);
  const router = useRouter();

  useEffect(() => {
    loginCheck();
  }, [])

  function loginCheck() {
    const token = cookie.getCookie('token');
    if (!['/login/github'].includes(router.pathname)) {
      if (token) {
        http.get('/orgs').then((res: any[]) => {
          if (res.length && (["/", '/login'].includes(router.pathname))) {
            dispatch({organizationList: res});
            let oriName = res[0].name;
            router.push(`${decodeURIComponent(oriName)}/applications`);
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
      {/*@ts-ignore*/}
      <Context.Provider value={{state, dispatch}}>
        <TokenContext.Provider value={{token, dispatchToken}}>
          <Component {...pageProps} />
        </TokenContext.Provider>
      </Context.Provider>
    </div>
  )
}

export default App;
