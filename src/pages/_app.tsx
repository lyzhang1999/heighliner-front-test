import {useEffect, useReducer, useState} from "react";
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {useRouter} from "next/router";

import {initState, Context, reducer} from "@/utils/store";
import {ThemeProvider} from '@mui/material/styles';

import '@/styles/globals.scss';
import cookie from "@/utils/cookie";
import Notice from '@/components/Notice/index';
import GlobalContxt from "@/components/GlobalContxt";
import theme from "@/utils/theme";
import {getOrgList} from "@/utils/api/org";
import {CssBaseline} from "@mui/material";
import {find} from "lodash-es";
import {getCurrentOrg, getDefaultOrg, getOrganizationNameByUrl} from "@/utils/utils";

const noCheckOriPage = ['/login/github', '/signup'];
const noCheckPathPage = ['/organizations', '/settings'];

function App({Component, pageProps}: AppProps) {
  const [state, dispatch] = useReducer(reducer, initState);
  const [getOriSuccess, setOriSuccess] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
    loginCheck();
  }, []);

  function loginCheck() {
    if (!noCheckOriPage.includes(router.pathname)) {
      if (cookie.getCookie('token')) {
        getOrgList().then(res => {
          let list = res.data;
          dispatch({
            organizationList: list,
          });
          let defaultOriName = getDefaultOrg(list).name;
          if ((["/", '/login', '/signup'].includes(router.pathname))) {
            location.pathname = `${defaultOriName}/applications`;
            return;
          }
          if (noCheckPathPage.includes(location.pathname)) {
            dispatch({currentOrganization: getCurrentOrg(list[0])})
            setGetOriSuccess();
            return;
          }
          let currentOri = find(list, {name: getOrganizationNameByUrl()});
          if (currentOri) {
            dispatch({currentOrganization: getCurrentOrg(currentOri)})
            setGetOriSuccess();
            return;
          }
          location.pathname = `${defaultOriName}/applications`;
        }).catch(err => {
          router.push("/login");
          setGetOriSuccess();
        })
      } else {
        setGetOriSuccess()
        router.push("/login");
      }
    } else {
      setGetOriSuccess()
    }
  }

  function setGetOriSuccess(){
    setTimeout(() => {
      setOriSuccess(true)
    }, 0)
  }

  return (
    <div>
      <Head>
        <title>Heighliner Platform · Speed up Cloud Native Application Development</title>
        <meta name="description" content="Heighliner Cloud · Speed up Cloud Native Application Development"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico"/>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Context.Provider value={{state, dispatch}}>
          <Notice/>
          <GlobalContxt/>
          {getOriSuccess && <Component {...pageProps} />}
        </Context.Provider>
      </ThemeProvider>
    </div>
  )
}

export default App;
