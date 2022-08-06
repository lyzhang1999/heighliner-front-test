import * as React from "react";
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getOriIdByContext, getQuery, getUrlEncodeName, Message} from "@/utils/utils";
import {baseURL} from '@/utils/axios';
import {EventSourcePolyfill} from "event-source-polyfill";
import {getApplicationStatus, ApplicationStatus} from "@/api/application";
import {Alert} from "@mui/material";
import clsx from "clsx";
import {get, isEmpty} from "lodash-es";
import styles from "./index.module.scss";
import "xterm/css/xterm.css";
import {getAppTimeLine, GetAppTimeLineRes} from "@/api/creatingApp";

const CreatingApplication = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [durationTime, setDurationTime] = useState<number>(0);
  const [skipTime, setSkipTime] = useState<number>(-1);
  const router = useRouter();
  const [number, setNumber] = useState(0);
  const [timeLine, setTimeLine] = useState<GetAppTimeLineRes[]>([]);

  let app_id: string = getQuery('app_id');
  let release_id: string = getQuery('release_id');

  let durationTimeInterval: ReturnType<typeof setInterval>;
  let getStatusInterval: any;
  let getTimeLineInterval: any;
  let term: any = null;
  let leaveFlag: boolean = false;
  let ro: any = null;
  let globalState = '';

  function getTimeLine() {
    getAppTimeLine({app_id, release_id}).then(res => {
      setTimeLine(res);
      let index = 0;
      res.map((item, i) => {
        if (item.status === 'succeeded') {
          index = i + 1;
        }
      })
      setNumber(index);
      console.warn(index);
    })
  }

  useEffect(() => {
    getTimeLine()
    getTimeLineInterval = setInterval(() => {
      getTimeLine();
    }, 1000 * 5)
    return () => {
      getTimeLineInterval && clearInterval(getTimeLineInterval)
    }
  }, [])

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
        durationTimeInterval && clearInterval(durationTimeInterval);
        getTimeLineInterval && clearInterval(getTimeLineInterval);
        if (!getQuery('foromPane')) {
          setSkipTime(5);
        }
      }
      if (status === ApplicationStatus.FAILED) {
        if (completion_time && start_time) {
          setDurationTime(Math.trunc((completion_time - start_time)));
        }
        getStatusInterval && clearInterval(getStatusInterval);
        durationTimeInterval && clearInterval(durationTimeInterval);
        getTimeLineInterval && clearInterval(getTimeLineInterval);
      }
    })
  }

  useEffect(() => {
    getStatus(true);
    getStatusInterval = setInterval(getStatus, 5000);
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
        <div className={styles.timeLine}>
          {
            !isEmpty(timeLine) && timeLine.map((item, index) => {
              let detail = '';
              try {
                detail = JSON.parse(item.detail);
              } catch (e) {
                console.warn(e)
              }
              let status = get(detail, 'data.status', 'processing');
              console.warn(status)
              return (
                <div key={item.id} className={styles.lineItem}>
                  <div className={clsx(styles.line)}>
                    {
                      (number >= index) &&
                      <div className={styles.activeLine}></div>
                    }
                  </div>
                  <div className={styles.circleWrapper}>
                    <div className={clsx(styles.circlePoint, (number >= index) && styles.circlePointDone)}></div>
                    <div
                      className={clsx(styles.circle, (number === index) && styles.circleDoing, (number > index) && styles.circleDone)}>
                    </div>
                    <div className={styles.desc}>
                      <div>{item.description}</div>
                    </div>
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </Layout>
  )
}

export default CreatingApplication
