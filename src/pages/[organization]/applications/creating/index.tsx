import * as React from "react";
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getOriIdByContext, getQuery, getUrlEncodeName, Message} from "@/utils/utils";
import {baseURL} from '@/utils/axios';
import {EventSourcePolyfill} from "event-source-polyfill";
import cookie from "@/utils/cookie";
import {getApplicationStatus, ApplicationStatus} from "@/api/application";
import {Alert} from "@mui/material";
import clsx from "clsx";
import {
  Timeline,
  TimelineItem,
  TimelineSeparator,
  TimelineConnector,
  TimelineContent,
  TimelineDot
} from "@mui/lab";

import {get} from "lodash-es";
import styles from "./index.module.scss";
import "xterm/css/xterm.css";
import {getToken} from "@/utils/token";


const list = [
  {
    desc: 'Createing 1'
  },
  {
    desc: 'Createing 2'
  },
  {
    desc: 'Createing 3'
  },
  {
    desc: 'Createing 4'
  },
]

const CreatingApplication = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [durationTime, setDurationTime] = useState<number>(0);
  const [skipTime, setSkipTime] = useState<number>(-1);
  const router = useRouter();
  const [number, setNumber] = useState(1);

  let app_id: string = getQuery('app_id');
  let release_id: string = getQuery('release_id');

  let durationTimeInterval: ReturnType<typeof setInterval>;
  let getStatusInterval: any;
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
        durationTimeInterval && clearInterval(durationTimeInterval)
        if (!getQuery('foromPane')) {
          setSkipTime(5);
        }
      }
      if (status === ApplicationStatus.FAILED) {
        if (completion_time && start_time) {
          setDurationTime(Math.trunc((completion_time - start_time)));
        }
        getStatusInterval && clearInterval(getStatusInterval);
        durationTimeInterval && clearInterval(durationTimeInterval)
      }
    })
  }

  useEffect(() => {
    getStatus(true);
    getStatusInterval = setInterval(getStatus, 5000);
    renderLog();
    return () => {
      getStatusInterval && clearInterval(getStatusInterval);
      durationTimeInterval && clearInterval(durationTimeInterval);
      leaveFlag = true;
      try {
        ro && ro.unobserve(document.getElementById('TERMIANLWRAPPER'));
      } catch (e) {
        console.log('ro.unobserve error')
      }
    }
  }, [])

  function renderLog() {
    const initTerminal = async () => {
      const {Terminal} = await import('xterm')
      const {FitAddon} = await import('xterm-addon-fit');
      const fitAddon = new FitAddon();
      term = new Terminal({
        fontFamily: "Monaco, Menlo, Consolas, Courier New, monospace",
        fontSize: 12,
        lineHeight: 1,
        scrollback: 999999,
      })
      term.loadAddon(fitAddon);
      term.open(document.getElementById('TERMINAL'));
      fitAddon.fit();
      var target = document.getElementById('TERMIANLWRAPPER');
      ro = new ResizeObserver(() => {
        try {
          fitAddon.fit();
        } catch (e) {
          console.log('fitAddon.fit() err')
        }
      });
      if (target) {
        ro.observe(target);
      }
      getLogEventSource();
    }
    setTimeout(() => {
      initTerminal()
    }, 0);
  }

  function getLogEventSource() {
    console.warn('getLogEventSource')
    const url = `${baseURL}orgs/${getOriIdByContext()}/applications/${app_id}/releases/${release_id}/logs`
    const token = getToken();
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

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    if (skipTime > 0) {
      timer = setTimeout(() => {
        setSkipTime(skipTime - 1);
      }, 1000)
    } else if (skipTime === 0) {
      goDashboard();
    }
    return () => clearTimeout(timer)
  }, [skipTime])

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

        {/*<Timeline>*/}
        {/*  <TimelineItem>*/}
        {/*    <TimelineSeparator>*/}
        {/*      <TimelineDot/>*/}
        {/*      <TimelineConnector/>*/}
        {/*    </TimelineSeparator>*/}
        {/*    <TimelineContent>Eat</TimelineContent>*/}
        {/*  </TimelineItem>*/}
        {/*  <TimelineItem>*/}
        {/*    <TimelineSeparator>*/}
        {/*      <TimelineDot/>*/}
        {/*      <TimelineConnector/>*/}
        {/*    </TimelineSeparator>*/}
        {/*    <TimelineContent>Code</TimelineContent>*/}
        {/*  </TimelineItem>*/}
        {/*  <TimelineItem>*/}
        {/*    <TimelineSeparator>*/}
        {/*      <TimelineDot/>*/}
        {/*    </TimelineSeparator>*/}
        {/*    <TimelineContent>Sleep</TimelineContent>*/}
        {/*  </TimelineItem>*/}
        {/*</Timeline>*/}

        {/*<div className={styles.timeLine}>*/}
        {/*  {*/}
        {/*    list.map((item, index) => {*/}
        {/*      return (*/}
        {/*        <div key={index} className={styles.lineItem}>*/}
        {/*          <div className={clsx(styles.line)}>*/}
        {/*            {*/}
        {/*              (number >= index) &&*/}
        {/*              <div className={styles.activeLine}></div>*/}
        {/*            }*/}
        {/*          </div>*/}
        {/*          <div className={styles.circleWrapper}>*/}
        {/*            <div className={clsx(styles.circlePoint, (number >= index) && styles.circlePointDone)}></div>*/}
        {/*            <div*/}
        {/*              className={clsx(styles.circle, (number === index) && styles.circleDoing, (number > index) && styles.circleDone)}>*/}
        {/*            </div>*/}
        {/*            <div className={styles.desc}>*/}
        {/*              <div>{item.desc}...</div>*/}
        {/*            </div>*/}
        {/*          </div>*/}
        {/*        </div>*/}
        {/*      )*/}
        {/*    })*/}
        {/*  }*/}
        {/*</div>*/}

        <div className={styles.infoWrapper}>
          <Alert severity="info">Start {Math.trunc(durationTime / 60)}m {durationTime % 60}s</Alert>
          {
            (status === ApplicationStatus.FAILED) && (!getQuery('foromPane')) &&
            <Alert severity="error">
              The Application Filed!
            </Alert>
          }
          {
            status === ApplicationStatus.COMPLETED && (!getQuery('foromPane')) &&
            <Alert severity="success">
              Success, auto go panel page after {skipTime}s
            </Alert>
          }
        </div>
        <div id="TERMINAL"
             className={styles.terminal}
        >
        </div>
      </div>
    </Layout>
  )
}

export default CreatingApplication
