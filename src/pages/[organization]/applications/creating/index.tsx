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


export function getQueryVariable(variable: string) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return (false);
}

//  Completed
//  Processing
//  Failed


const CreatingApplication = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const router = useRouter();

  useEffect(() => {
    let app_id = getQueryVariable('app_id');
    let release_id = getQueryVariable('release_id');
    console.warn(app_id, release_id)


    let timer = setInterval(() => {
      http.get(`/orgs/${getOriginzationByUrl()}/applications/${app_id}/releases/${release_id}`).then(res => {
        let {status} = res;
        if (status !== 'Processing') {
          clearInterval(timer);
        }
        if (status === 'Completed') {
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
        fitAddon.fit();
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

  return (
    <Layout pageHeader="Creating Application"
    >
      <div id="creatingTerminal" className={styles.wrapper}>
        <div id="terminal"
             className={styles.terminal}
        >
        </div>
      </div>
    </Layout>
  )
}

export default CreatingApplication
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

