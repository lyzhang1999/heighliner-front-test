import {useEffect, useReducer} from "react";
import type {AppProps} from 'next/app';
import Head from 'next/head';

import {TokenContext, useTokenReducer} from '@/hooks/token';
import {initState, Context, reducer} from "@/utils/store";

import '@/styles/globals.scss';
import cookie from "@/utils/cookie";
import useGetOriList from "@/hooks/getOriList";

function App({Component, pageProps}: AppProps) {
  const [token, dispatchToken] = useTokenReducer();
  const [state, dispatch] = useReducer(reducer, initState);
  const {getOriList} = useGetOriList(dispatch);

  useEffect(() => {
    loginCheck();
  }, [])

  function loginCheck(){
    const token = cookie.getCookie('token');
    if(token){
      getOriList();
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
