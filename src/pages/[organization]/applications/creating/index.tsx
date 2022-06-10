import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {Terminal} from 'xterm';
import styles from "./index.module.scss";
import "xterm/css/xterm.css"
import * as React from "react";
import {useRouter} from "next/router";
import {getOrganizationByUrl, getQuery} from "@/utils/utils";
import {baseURL} from '@/utils/axios';
import {EventSourcePolyfill} from "event-source-polyfill";
import cookie from "@/utils/cookie";
import {getApplicationStatus, ApplicationStatus} from "@/utils/api/application";
import {Alert} from "@mui/material";

interface LogRes {
  data: string
}

const CreatingApplication = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [durationTime, setDurationTime] = useState<number>(0);
  const [skipTime, setSkipTime] = useState<number>(5);
  const router = useRouter();

  let app_id: string = getQuery('app_id');
  let release_id: string = getQuery('release_id');

  let durationTimeInterval: any = null;
  let getStatusInterval: any = null;
  let getlogTimeOut: any = null;
  let resizeCb: any = null;
  let skipTimer: any = null;

  // close server render

  useEffect(() => {
    function getStatus(isFirst: boolean) {
      getApplicationStatus({app_id, release_id}).then(({status}) => {
        setStatus(status);
        if (status !== ApplicationStatus.PROCESSING) {
          if (isFirst) {
            durationTimeInterval = setInterval(() => {
              setDurationTime(t => t + 1)
            }, 1000)
          }
        }
        if (status === ApplicationStatus.COMPLETED) {
          durationTimeInterval && clearInterval(durationTimeInterval)
          durationTimeInterval = null;
          goDashboard();
          // if (isFirst) {
          //   goDashboard();
          // } else {
          //   skip();
          // }
        }
      })
    }

    getStatus(true);
    getStatusInterval = setInterval(getStatus, 5000);
    getlog();
    return () => {
      getStatusInterval && clearInterval(getStatusInterval);
      getStatusInterval = null;
      durationTimeInterval && clearInterval(durationTimeInterval);
      durationTimeInterval = null;
      resizeCb && window.removeEventListener('resize', resizeCb);
      skipTimer && clearInterval(skipTimer);
      skipTimer = null;
      getlogTimeOut && clearTimeout(getlogTimeOut);
      getlogTimeOut = null;
    }
  }, [])

  function getlog() {
    const initTerminal = async () => {
      const {Terminal} = await import('xterm')
      const {FitAddon} = await import('xterm-addon-fit');
      const fitAddon = new FitAddon();
      const term = new Terminal({
        fontFamily: "Monaco,Menlo,Consolas,Courier New,monospace",
        fontSize: 12,
        lineHeight: 0.2,
        scrollback: 99999,
      })
      term.loadAddon(fitAddon);
      // @ts-ignore
      term.open(document.getElementById('terminal'));
      fitAddon.fit();
      resizeCb = function () {
        fitAddon.fit();
      }
      window.addEventListener('resize', resizeCb);
      const url = `${baseURL}orgs/${getOrganizationByUrl()}/applications/${app_id}/releases/${release_id}/logs`
      const token = cookie.getCookie('token');
      var test = new EventSourcePolyfill(url, {headers: {Authorization: `Bearer ${token}`}});
      test.addEventListener("MESSAGE", function (e: LogRes) {
        term.writeln(e.data);
      });
      test.addEventListener("END", function (e: LogRes) {
        test.close();
      });
    }
    getlogTimeOut = setTimeout(() => {
      initTerminal()
    }, 1000);
  }

  function goDashboard() {
    router.push(`/${getOrganizationByUrl()}/applications/detail?app_id=${app_id}&release_id=${release_id}`)
  }

  function skip() {
    skipTimer = setInterval(() => {
      setSkipTime(t => {
        console.warn(t)
        if (t === 1) {
          clearInterval(skipTimer);
          // goDashboard();
        }
        return t - 1;
      });
    }, 1000)
  }

  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  return (
    <Layout pageHeader="Creating Application"
    >
      <div id="creatingTerminal" className={styles.wrapper}>
        <Alert severity="info">Start {Math.trunc(durationTime / 60)}m {durationTime % 60}s ago</Alert>

        <div id="terminal"
             className={styles.terminal}
        >
        </div>
        {/*{*/}
        {/*  status === ApplicationStatus.COMPLETED &&*/}
        {/*  <Alert severity="success">*/}
        {/*    Success, auto go <span className={styles.goDashboard}*/}
        {/*                           onClick={goDashboard}>dashboard</span> after {skipTime}s*/}
        {/*  </Alert>*/}
        {/*}*/}
      </div>


    </Layout>
  )
}

export default CreatingApplication

// http://localhost/8/applications/creating?app_id=24&release_id=24

// http://localhost/2/applications/creating

{/*<div className={styles.timeLine}>*/
}
{/*  {*/
}
{/*    list.map((item, index) => {*/
}
{/*      return (*/
}
{/*        <div key={index} className={styles.lineItem}>*/
}
{/*          <div className={clsx(styles.line)}>*/
}
{/*            {*/
}
{/*              (number >= index) &&*/
}
{/*              <div className={styles.activeLine}></div>*/
}
{/*            }*/
}
{/*          </div>*/
}
{/*          <div className={styles.circleWrapper}>*/
}
{/*            <div className={clsx(styles.circlePoint, (number >= index) && styles.circlePointDone)}></div>*/
}
{/*            <div*/
}
{/*              className={clsx(styles.circle, (number === index) && styles.circleDoing, (number > index) && styles.circleDone)}>*/
}
{/*            </div>*/
}
{/*            <div className={styles.desc}>*/
}
{/*              <div>{item.desc}...</div>*/
}
{/*            </div>*/
}
{/*          </div>*/
}
{/*        </div>*/
}
{/*      )*/
}
{/*    })*/
}
{/*  }*/
}
{/*</div>*/
}

