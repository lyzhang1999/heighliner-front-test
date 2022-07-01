import * as React from "react";
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {Terminal} from 'xterm';
import {useRouter} from "next/router";
import {getOriIdByContext, getQuery, getUrlEncodeName, Message} from "@/utils/utils";
import {baseURL} from '@/utils/axios';
import {EventSourcePolyfill} from "event-source-polyfill";
import cookie from "@/utils/cookie";
import {getApplicationStatus, ApplicationStatus} from "@/utils/api/application";
import {Alert} from "@mui/material";
import {get} from "lodash-es";
import styles from "./index.module.scss";
import "xterm/css/xterm.css";


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
  let leaveFlag: boolean = false;
  let ro: any = null;
  let globalState = '';

  function getStatus(isFirst: boolean) {
    getApplicationStatus({app_id, release_id}).then((res) => {
      let {start_time, status, completion_time} = res;
      setStatus(status);
      globalState = status;
      if (status === ApplicationStatus.PROCESSING) {
        if (isFirst) {
          let time = new Date().getTime() - start_time * 1000;
          setDurationTime(Math.trunc(time / 1000));
          durationTimeInterval = setInterval(() => {
            setDurationTime(t => t + 1)
          }, 1000)
        }
      }
      if (status === ApplicationStatus.COMPLETED) {
        if (completion_time && start_time) {
          setDurationTime(Math.trunc((completion_time - start_time)));
        }
        getStatusInterval && clearInterval(getStatusInterval);
        getStatusInterval = null;
        durationTimeInterval && clearInterval(durationTimeInterval)
        durationTimeInterval = null;
        skip();
      }
      if (status === ApplicationStatus.FAILED) {
        if (completion_time && start_time) {
          setDurationTime(Math.trunc((completion_time - start_time)));
        }
        getStatusInterval && clearInterval(getStatusInterval);
        getStatusInterval = null;
        durationTimeInterval && clearInterval(durationTimeInterval)
        durationTimeInterval = null;
      }
    })
  }

  useEffect(() => {
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
      leaveFlag = true;
      try {
        ro && ro.unobserve(document.getElementById('TERMIANLWRAPPER'));
      } catch (e) {
        console.warn('ro.unobserve error')
      }
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
        lineHeight: 1,
        scrollback: 999999,
      })
      term.loadAddon(fitAddon);
      term.open(document.getElementById('terminal'));
      fitAddon.fit();

      var target = document.getElementById('TERMIANLWRAPPER');

      ro = new ResizeObserver(() => {
        try {
          fitAddon.fit();
        } catch (e) {
          console.warn('fitAddon.fit() err')
        }
      });

      if (target) {
        ro.observe(target);
      }

      window.addEventListener('resize', resizeCb);
      getLogEventSource();
    }
    getlogTimeOut = setTimeout(() => {
      initTerminal()
    }, 0);
  }

  function getLogEventSource() {
    console.warn('getLogEventSource')
    const url = `${baseURL}orgs/${getOriIdByContext()}/applications/${app_id}/releases/${release_id}/logs`
    const token = cookie.getCookie('token');
    var eventSource = new EventSourcePolyfill(url, {
      headers: {Authorization: `Bearer ${token}`},
      heartbeatTimeout: 1000 * 60 * 5
    });
    eventSource.onerror = function () {
      console.warn('onerror');
      eventSource.close();
      setTimeout(() => {
        console.warn('onerrorTimeout', globalState)
        if (leaveFlag) {
          return;
        }
        if (globalState === ApplicationStatus.PROCESSING) {
          getLogEventSource();
        }
      }, 1000)
    }
    eventSource.addEventListener("MESSAGE", function (e) {
      term.writeln(get(e, 'data'));
    });
    eventSource.addEventListener("END", function (e) {
      console.warn('end')
      eventSource.close();
      setTimeout(() => {
        console.warn("onend" + globalState)
        if (leaveFlag) {
          return;
        }
        if (globalState === ApplicationStatus.PROCESSING) {
          getLogEventSource();
        }
      }, 5000);
    });
  }

  function goDashboard() {
    Message.success('Creat Success');
    router.replace(`/${getUrlEncodeName()}/applications/panel?app_id=${app_id}&release_id=${release_id}`)
  }

  function skip() {
    skipTimer = setInterval(() => {
      setSkipTime(t => {
        if (t === 1) {
          clearInterval(skipTimer);
          goDashboard();
        }
        return t - 1;
      });
    }, 1000)
  }

  // close server render
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  return (
    <Layout pageHeader="Creating Application"
            notStandardLayout
    >
      <div className={styles.wrapper} id="TERMIANLWRAPPER">
        <div className={styles.infoWrapper}>
          <Alert severity="info">Start {Math.trunc(durationTime / 60)}m {durationTime % 60}s</Alert>
          {
            status === ApplicationStatus.FAILED &&
            <Alert severity="error">
              The Application Filed!
            </Alert>
          }
          {
            status === ApplicationStatus.COMPLETED &&
            <Alert severity="success">
              Success, auto go panel page after {skipTime}s
            </Alert>
          }
        </div>
        <div id="terminal"
             className={styles.terminal}
        >
        </div>
      </div>
    </Layout>
  )
}

export default CreatingApplication
