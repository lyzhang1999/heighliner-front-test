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
import {getCurrentOrg, getDefaultOrg, getOrganizationNameByUrl, getStateByContext} from "@/utils/utils";

const noCheckLoginPage = ['/login/github', '/signup', '/distributor/post-install-github-app'];
const noCheckOrgNamePage = ['/organizations', '/settings'];
const ifLoginDisablePage = ["/", '/login', '/signup'];

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
    if (!noCheckLoginPage.includes(router.pathname)) {
      if (cookie.getCookie('token')) {
        getOrgList().then(res => {
          let list = res.data;
          dispatch({
            organizationList: list,
          });
          let defaultOriName = getDefaultOrg(list).name;
          if ((ifLoginDisablePage.includes(router.pathname))) {
            location.pathname = `${encodeURIComponent(defaultOriName)}/applications`;
            return;
          }
          if (noCheckOrgNamePage.includes(location.pathname)) {
            dispatch({currentOrganization: getCurrentOrg(list[0])})
            startRender();
            return;
          }
          let currentOri = find(list, {name: getOrganizationNameByUrl()});
          if (currentOri) {
            dispatch({currentOrganization: getCurrentOrg(currentOri)})
            startRender();
            return;
          }
          location.pathname = `${encodeURIComponent(defaultOriName)}/applications`;
        }).catch(err => {
          router.push("/login");
          startRender();
        })
      } else {
        startRender()
        router.push("/login");
      }
    } else {
      startRender()
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
          {render && <Component {...pageProps} />}
        </Context.Provider>
      </ThemeProvider>
    </div>
  )
}

export default App;
