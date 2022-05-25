import type { AppProps } from 'next/app'
import Head from 'next/head'

import { TokenContext, useTokenReducer } from '@/hooks/token'
import '@/styles/globals.css'


function App({ Component, pageProps }: AppProps) {
  const [token, dispatchToken] = useTokenReducer();

  return (
    <div>
      <Head>
        <title>Heighliner Platform · Speed up Cloud Native Application Development</title>
        <meta name="description" content="Heighliner Platform · Speed up Cloud Native Application Development" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
      </Head>
      <TokenContext.Provider value={{token, dispatchToken}}>
        <Component {...pageProps} />
      </TokenContext.Provider>
    </div>
  )
}

export default App;
