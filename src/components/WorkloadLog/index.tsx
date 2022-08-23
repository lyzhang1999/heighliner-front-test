import styles from './index.module.scss';
import Drawer from '@mui/material/Drawer';
import {GetLogParams} from "@/components/Panel/Env/Resources";
import React, {useEffect} from "react";
import CloseIcon from "@mui/icons-material/Close";
import {baseURL} from "@/utils/axios";
import {getToken} from "@/utils/token";
import {EventSourcePolyfill} from "event-source-polyfill";
import {get} from "lodash-es";
import "xterm/css/xterm.css";

interface Props {
  logVisible: boolean,
  setLogVisible: (val: boolean) => void,
  logsParams: GetLogParams | null
}

export default function WorkloadLog({setLogVisible, logVisible, logsParams}: Props) {
  let term: any = null;

  useEffect(() => {
    setTimeout(() => {
      getTerminal();
    }, 0)
  }, [])

  function getTerminal() {
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
      term.open(document.getElementById('LOGS'));
      fitAddon.fit();
      getLogEventSource();
    }
    setTimeout(() => {
      initTerminal()
    }, 0);
  }

  function getLogEventSource() {
    let {container_name, resource_name, pod_name, resource_type, org_id, app_id, env_id} = logsParams as GetLogParams;
    const searchParams = new URLSearchParams({
      container_name,
      resource_name,
      pod_name,
      resource_type,
    });
    const url = new URL(
      `${baseURL}/orgs/${org_id}/applications/${app_id}/envs/${env_id}/resources/logs?${searchParams.toString()}`
    );
    const token = getToken();
    var eventSource = new EventSourcePolyfill(url.toString(), {
      headers: {Authorization: `Bearer ${token}`},
      heartbeatTimeout: 1000 * 60 * 5,
    });
    eventSource.onerror = function () {
      console.warn('onerror');
      eventSource.close();
    }
    eventSource.addEventListener("MESSAGE", function (e) {
      term.writeln(get(e, 'data'));
    });
    eventSource.addEventListener("END", function (e) {
      console.warn('logs end')
      eventSource.close();
    });
  }

  return (
    <Drawer
      anchor="right"
      open={logVisible}
      onClose={() => {
        setLogVisible(false)
      }}
    >
      <div className={styles.wrapper}>
        <div className={styles.header} title="Close">
          <div className={styles.title}>
            Container Logs
          </div>
          <div className={styles.closeIcon}>
            <CloseIcon onClick={() => setLogVisible(false)}/>
          </div>
        </div>
        <div id="LOGSWRAPPER" className={styles.logsWrapper}>
          <div id="LOGS" className={styles.logs}></div>
        </div>
      </div>
    </Drawer>
  )
}
