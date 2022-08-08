import {useEffect, useReducer, useState} from "react";
import type {AppProps} from 'next/app';
import Head from 'next/head';
import {useRouter} from "next/router";

import {initState, Context, reducer} from "@/utils/store";
import {ThemeProvider} from '@mui/material/styles';

import '@/styles/globals.scss';
import Notice from '@/components/Notice/index';
import GlobalContxt from "@/components/GlobalContxt";
import theme from "@/utils/theme";
import {getOrgList, OrgList} from "@/api/org";
import {CssBaseline} from "@mui/material";
import {find, get} from "lodash-es";
import {getCurrentOrg, getOrganizationNameByUrl, getStateByContext, parseInitialDefaultOrg} from "@/utils/utils";
import { GlobalLoadingProvider } from "@/basicComponents/GlobalLoadingProvider";
import {deleteToken, getToken} from "@/utils/token";
import { getUserInfo } from "@/api/profile";
import { $$ } from "@/utils/console";

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
    if (getToken()) {
      getOrgList().then(async res => {
        let list = res.data;
        dispatch({
          organizationList: list,
        });

        let initialDefaultOrg: OrgList = parseInitialDefaultOrg(list);
        let userSetDefaultOrg: OrgList | undefined;

        const userInfo = await getUserInfo();
        // Check user whether have default organization.
        if (
          userInfo.default_org_id !== undefined &&
          userInfo.default_org_id > 0
        ) {
          userSetDefaultOrg = list.find(item => item.id === userInfo.default_org_id);
        }

        /**
         * Enter preferred organization set by user in organization page.
         */
        if(userSetDefaultOrg && userSetDefaultOrg.name && "/" === router.pathname) {
          location.pathname = `${encodeURIComponent(userSetDefaultOrg.name)}/applications`;
          return;
        }

        if (ifLoginDisablePage.includes(router.pathname)) {
          location.pathname = `${encodeURIComponent(initialDefaultOrg.name)}/applications`;
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
          location.pathname = `${encodeURIComponent(initialDefaultOrg.name)}/applications`;
        }
      }).catch(err => {
        $$.error(err);
        if ((get(err, "response.status") === 302) && (get(err, 'response.data.redirect_to') === 'userInfoComplete')) {
          if (location.pathname !== '/sign-up') {
            location.href = location.origin + '/sign-up?completeInfo=true'
          }else{
            startRender();
          }
        } else {
          deleteToken();
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
