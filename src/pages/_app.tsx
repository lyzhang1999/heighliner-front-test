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
import {getOrganizationNameByUrl} from "@/utils/utils";

const noCheckOriPage = ['/login/github', '/signup'];
const noCheckPathPage = ['/organizations', '/settings'];

function App({Component, pageProps}: AppProps) {
  const [state, dispatch] = useReducer(reducer, initState);
  const [getOriSuccess, setGetOriSuccess] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
    loginCheck();
  }, []);

  function loginCheck() {
    const token = cookie.getCookie('token');
    if (!noCheckOriPage.includes(router.pathname)) {
      if (token) {
        getOrgList().then(res => {
          let list = res.data;
          dispatch({
            organizationList: list,
          });
          let oriName = encodeURIComponent(list[0]?.name);
          if ((["/", '/login', '/signup'].includes(router.pathname))) {
            location.pathname = `${oriName}/applications`;
          }
          let currentOri = find(list, {name: getOrganizationNameByUrl()});
          if (currentOri) {
            dispatch({currentOiganization: {...currentOri, ...currentOri.member}})
            setGetOriSuccess(true);
          } else {
            if(noCheckPathPage.includes(location.pathname)){
              dispatch({currentOiganization: {...list[0], ...list[0].member}})
              setGetOriSuccess(true);
            }else{
              location.pathname = `${oriName}/applications`;
            }
          }
        }).catch(err => {
          setGetOriSuccess(true)
        })
      } else {
        setGetOriSuccess(true)
        router.push("/login");
      }
    } else {
      setGetOriSuccess(true)
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
