import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {Terminal} from 'xterm';
import styles from "./index.module.scss";
import "xterm/css/xterm.css"
import * as React from "react";
import {useRouter} from "next/router";
import {getOriginzationByUrl} from "@/utils/utils";
import http from '@/utils/axios';
import {EventSourcePolyfill} from 'event-source-polyfill';
import cookie from "@/utils/cookie";
import {getApplicationStatus, ApplicationStatus} from "@/utils/api/application";
import {Alert} from "@mui/material";
import {intersection} from "lodash-es";


export function getQueryVariable(variable: string): string {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return "";
}

//  Completed
//  Processing
//  Failed


const CreatingApplication = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [time, setTime] = useState<number>(0);
  const [timer, setTimer] = useState<any>(null);
  const [appId, setAppId] = useState<string>('');
  const [releaseId, setReleaseID] = useState<string>('');
  const [skipTime, setSkipTime] = useState<number>(5);
  const [skipTimer, setSkipTimer] = useState<any>(null);
  const router = useRouter();


  useEffect(() => {
    const timer = setInterval(() => {
      setTime(t => t + 1)
    }, 1000)
    setTimer(timer);
    return () => {
      clearInterval(timer)
      setTimer(null);
      skipTimer && clearInterval(skipTimer);
    }
  }, [])

  useEffect(() => {
    let app_id: string = getQueryVariable('app_id');
    let release_id: string = getQueryVariable('release_id');
    setAppId(app_id);
    setReleaseID(release_id);
    console.warn(app_id, release_id)

    let timerGetStatus = setInterval(() => {
      getApplicationStatus({app_id, release_id}).then((res) => {
        let {status} = res;
        setStatus(status);
        if (status !== ApplicationStatus.PROCESSING) {
          clearInterval(timerGetStatus);
        }
        if (status === ApplicationStatus.COMPLETED) {
          clearInterval(timer)
          setTimer(null);
          // skip();
          // router.push(`/${getOriginzationByUrl()}/applications/detail?app_id=${app_id}&release_id=${release_id}`)
        }
      })
    }, 5000)

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
      window.onresize = function () {
        try {
          fitAddon.fit();
        } catch (e) {

        }
        // term.scrollToBottom();
      };
      const url = `http://heighliner-cloud.heighliner.cloud/api/orgs/${getOriginzationByUrl()}/applications/${app_id}/releases/${release_id}/logs`
      const token = cookie.getCookie('token');

      var test = new EventSourcePolyfill(url, {headers: {Authorization: `Bearer ${token}`}});
      test.addEventListener("MESSAGE", function (e) {
        console.warn(e.data)
        term.writeln(e.data);
      });
      test.addEventListener("END", function (e) {
        test.close();
      });
    }
    setTimeout(() => {
      initTerminal()
    }, 100)

    return () => {
      clearInterval(timer);
    }
  }, [])

  // close server render
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  function goDashboard() {
    router.push(`/${getOriginzationByUrl()}/applications/detail?app_id=${appId}&release_id=${releaseId}`)
  }

  function skip(){
    const timer = setInterval(() => {
      setSkipTime(t => {
        if(t === 1){
          clearInterval(timer);
          goDashboard();
        }
        return t - 1;
      });
    }, 1000)
    setSkipTimer(timer);
  }

  return (
    <Layout pageHeader="Creating Application"
    >
      <div id="creatingTerminal" className={styles.wrapper}>
        <Alert severity="info">Start {Math.trunc(time / 60)}m {time % 60}s ago</Alert>

        <div id="terminal"
             className={styles.terminal}
        >
        </div>
        {/*{*/}
        {/*  status === ApplicationStatus.COMPLETED &&*/}
        {/*  // true &&*/}
        {/*  <Alert severity="success">*/}
        {/*    Success, auto go <span className={styles.goDashboard} onClick={goDashboard}>dashboard</span> after {skipTime}s*/}
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

