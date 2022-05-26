import {useReducer} from "react";
import type {AppProps} from 'next/app'
import Head from 'next/head'

import {TokenContext, useTokenReducer} from '@/hooks/token';
import {initState, Context, reducer} from "@/utils/store.ts";

import '@/styles/globals.css';

function App({Component, pageProps}: AppProps) {
  const [token, dispatchToken] = useTokenReducer();
  const [state, dispatch] = useReducer(reducer, initState);

  return (
    <div>
      <Head>
        <title>Heighliner Platform · Speed up Cloud Native Application Development</title>
        <meta name="description" content="Heighliner Cloud · Speed up Cloud Native Application Development"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico"/>
      </Head>
      <Context.Provider value={{state, dispatch, ...state as object}}>
        <TokenContext.Provider value={{token, dispatchToken}}>
          <Component {...pageProps} />
        </TokenContext.Provider>
      </Context.Provider>
    </div>
  )
}

export default App;
