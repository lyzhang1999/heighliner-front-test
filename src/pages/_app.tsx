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
import {getOrgList} from "@/api/org";
import {CssBaseline} from "@mui/material";
import {find, get} from "lodash-es";
import {getCurrentOrg, getDefaultOrg, getOrganizationNameByUrl, getStateByContext} from "@/utils/utils";
import { GlobalLoadingProvider } from "@/basicComponents/GlobalLoadingProvider";

const noCheckLoginPage = [
  '/sign-in',
  '/login/github',
  '/sign-up',
  '/distributor/post-install-github-app',
  '/distributor/post-auth-github',
  '/invite-confirm',
  '/forgot-password',
  "/reset-password",
  '/version',
  '/signup-success',
  "/verify-email"
];

const noCheckOrgNamePage = [
  '/organizations',
  '/profile',
  "/gitProvider",
  '/distributor/post-auth-github',
  "/invite-confirm"
];
const ifLoginDisablePage = ["/", '/sign-in', '/sign-up'];

function App({Component, pageProps}: AppProps) {
  const [state, dispatch] = useReducer(reducer, initState);
  const [render, setRender] = useState<boolean>(false)
  const router = useRouter();

  useEffect(() => {
    loginCheck();
    initSpread();
  }, []);

  function initSpread() {
    if (document.documentElement.clientWidth < 1200) {
      dispatch({'menuSpread': false});
    }
    window.addEventListener('resize', () => {
      let bool = getStateByContext(['menuSpread']);
      let flag = getStateByContext(['setSpreadFlag']);
      if (flag) {
        return;
      }
      if (document.documentElement.clientWidth > 1200) {
        if (!bool) {
          dispatch({'menuSpread': true});
        }
      } else {
        if (bool) {
          dispatch({'menuSpread': false});
        }
      }
    })
  }

  function loginCheck() {
    if (cookie.getCookie('token')) {
      getOrgList().then(res => {
        let list = res.data;
        dispatch({
          organizationList: list,
        });
        let defaultOriName = getDefaultOrg(list).name;
        if (ifLoginDisablePage.includes(router.pathname)) {
          location.pathname = `${encodeURIComponent(defaultOriName)}/applications`;
          return;
        }
        if (noCheckOrgNamePage.includes(router.pathname)) {
          dispatch({currentOrganization: getCurrentOrg(list[0])})
          startRender();
          return;
        }
        let currentOri = find(list, {name: getOrganizationNameByUrl()});
        if (currentOri) {
          dispatch({currentOrganization: getCurrentOrg(currentOri)})
          startRender();
          return;
        } else {
          location.pathname = `${encodeURIComponent(defaultOriName)}/applications`;
        }
      }).catch(err => {
        if ((get(err, "response.status") === 302) && (get(err, 'response.data.redirect_to') === 'userInfoComplete')) {
          if (location.pathname !== '/sign-up') {
            location.href = location.origin + '/sign-up?completeInfo=true'
          }else{
            startRender();
          }
        } else {
          cookie.delCookie("token");
          location.pathname = '/sign-in';
        }
      })
    } else {
      if (noCheckLoginPage.includes(router.pathname)) {
        startRender();
      } else {
        location.pathname = '/sign-in';
      }
    }
  }

  function startRender() {
    setTimeout(() => {
      setRender(true)
    }, 0)
  }

  return (
    <div>
      <Head>
        <title>ForkMain · Speed up Cloud Native Application Development</title>
        <meta name="description" content="ForkMain · Speed up Cloud Native Application Development"/>
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon.ico"/>
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline/>
        <Context.Provider value={{state, dispatch}}>
          <Notice/>
          <GlobalContxt/>
          <GlobalLoadingProvider>
            <>
              {render && <Component {...pageProps} />}
            </>
          </GlobalLoadingProvider>
        </Context.Provider>
      </ThemeProvider>
    </div>
  )
}

export default App;
