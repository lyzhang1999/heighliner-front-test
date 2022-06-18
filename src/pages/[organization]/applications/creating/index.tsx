import * as React from "react";
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {Terminal} from 'xterm';
import {useRouter} from "next/router";
import {getOrganizationNameByUrl, getOriIdByContext, getQuery, Message} from "@/utils/utils";
import {baseURL} from '@/utils/axios';
import {EventSourcePolyfill} from "event-source-polyfill";
import cookie from "@/utils/cookie";
import {getApplicationStatus, ApplicationStatus} from "@/utils/api/application";
import {Alert} from "@mui/material";

import styles from "./index.module.scss";
import "xterm/css/xterm.css";

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
  let term: any = null;

  useEffect(() => {
    function getStatus(isFirst: boolean) {
      getApplicationStatus({app_id, release_id}).then(({status}) => {
        setStatus(status);
        if (status !== ApplicationStatus.PROCESSING) {
          if (isFirst) {
            // durationTimeInterval = setInterval(() => {
            //   setDurationTime(t => t + 1)
            // }, 1000)
          }
        }
        if (status === ApplicationStatus.COMPLETED) {
          durationTimeInterval && clearInterval(durationTimeInterval)
          durationTimeInterval = null;
          goDashboard();
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
      term = new Terminal({
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
      getLog();
    }
    getlogTimeOut = setTimeout(() => {
      initTerminal()
    }, 1000);
  }

  function getLog(){
    console.warn('getLog')
    const url = `${baseURL}orgs/${getOriIdByContext()}/applications/${app_id}/releases/${release_id}/logs`
    const token = cookie.getCookie('token');
    var eventSource = new EventSourcePolyfill(url, {headers: {Authorization: `Bearer ${token}`}});
    console.warn(eventSource)
    eventSource.onerror = function(){
      eventSource.close();
      setTimeout(() => {
        getLog();
      }, 1000)
    }
    // @ts-ignore
    eventSource.addEventListener("MESSAGE", function (e: LogRes) {
      term.writeln(e.data);
    });
    // @ts-ignore
    eventSource.addEventListener("END", function (e: LogRes) {
      console.warn('END')
      eventSource.close();
      setTimeout(() => {
        if(status === ApplicationStatus.PROCESSING){
          getLog();
        }
      }, 5000);

    });
  }

  function goDashboard() {
    Message.success('Creat Success');
    setTimeout(() => {
      router.replace(`/${getOrganizationNameByUrl()}/applications/panel?appId=${app_id}`)
    }, 2000)
  }

  // function skip() {
  //   skipTimer = setInterval(() => {
  //     setSkipTime(t => {
  //       console.warn(t)
  //       if (t === 1) {
  //         clearInterval(skipTimer);
  //         // goDashboard();
  //       }
  //       return t - 1;
  //     });
  //   }, 1000)
  // }

  // close server render
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  return (
    <Layout pageHeader="Creating Application"
    >
      <div id="creatingTerminal" className={styles.wrapper}>
        {/*<Alert severity="info">Start {Math.trunc(durationTime / 60)}m {durationTime % 60}s ago</Alert>*/}
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
// http://localhost/zhangze/applications/creating?app_id=8&release_id=8
