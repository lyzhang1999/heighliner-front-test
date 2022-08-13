import * as React from "react";
import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {useRouter} from "next/router";
import {getOriIdByContext, getQuery, getUrlEncodeName, Message} from "@/utils/utils";
import {baseURL} from '@/utils/axios';
import {EventSourcePolyfill} from "event-source-polyfill";
import {getApplicationStatus, ApplicationStatus} from "@/api/application";
import {Alert, Button} from "@mui/material";
import clsx from "clsx";
import {filter, get, groupBy, isEmpty, pick, sortBy} from "lodash-es";
import styles from "./index.module.scss";
import "xterm/css/xterm.css";
import {getAppTimeLine, GetAppTimeLineRes} from "@/api/creatingApp";
import {getToken} from "@/utils/token";
import {getPrStatus} from "@/api/gitProviders";

interface RepoType {
  pr_url: string,
  url: string
}

const CreatingApplication = () => {
  const [hasMounted, setHasMounted] = React.useState(false);
  const [status, setStatus] = React.useState('');
  const [durationTime, setDurationTime] = useState<number>(0);
  const [skipTime, setSkipTime] = useState<number>(-1);
  const router = useRouter();
  const [number, setNumber] = useState(0);
  const [timeLine, setTimeLine] = useState<GetAppTimeLineRes[]>([]);
  const [repoInfo, setRepoInfo] = useState<any>(null);
  const [prMerged, setPrMerged] = useState<boolean>(true);

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
      res = sortBy(res, (item) => item.step);
      setTimeLine(res);
      let index = 0;
      res.map((item, i) => {
        if (item.status === 'succeeded') {
          index = i + 1;
        }
        if (item.type !== "repository") {
          return;
        }
        try {
          let repos = get(JSON.parse(item.detail), 'data.repos', '');
          repos = filter(repos, (i) => i.status === "succeeded")
          if (repos) {
            let repo = pick(groupBy(repos, 'type'), ['creating', 'settingUp']);
            if (!isEmpty(repo)) {
              setRepoInfo(repo);
            }
          }
        } catch (e) {
        }
      })
      setNumber(index);
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
        // if (!getQuery('foromPane')) {
        //   // setSkipTime(5);
        // }
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
    router.replace(`/${getUrlEncodeName()}/applications/panel?app_id=${app_id}&release_id=${release_id}`)
  }

  function checkMerged(hasPr: boolean) {
    if (!hasPr) {
      goDashboard();
    } else {
      getPrStatus({app_id, release_id}).then(res => {
        let {merged} = res;
        if (merged) {
          goDashboard();
        } else {
          setPrMerged(false);
        }
      })
    }
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
              {/* Success, auto go panel page after {skipTime}s */}
              Create Application Success
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
        {
          repoInfo &&
          <div className={styles.repoInfo}>

            <div className={styles.repo}>
              {
                status === ApplicationStatus.COMPLETED &&
                <div className={styles.successHeader}>
                  Create App Success
                </div>
              }
              {
                get(repoInfo, 'creating', '') &&
                <div className={styles.info}>
                  The following repositories are created by ForkMain:
                </div>
              }
              {
                get(repoInfo, 'creating', []).map((item: RepoType) => {
                  return (
                    <div key={item.url} className={styles.repoList}
                         onClick={() => {
                           window.open(item.url)
                         }}
                    >{item.url}</div>
                  )
                })
              }
              {
                get(repoInfo, 'settingUp', '') &&
                <div className={styles.info}>
                  There are some Pull Requests that need to be merged:
                </div>
              }
              {
                get(repoInfo, 'settingUp', []).map((item: RepoType) => {
                  return (
                    <div key={item.pr_url} className={styles.repoList}
                         onClick={() => {
                           window.open(item.pr_url)
                         }}
                    >{item.pr_url}</div>
                  )
                })
              }
              {
                status === ApplicationStatus.COMPLETED &&
                <div className={styles.buttonWrapper}>
                  <Button
                    variant="contained"
                    onClick={() => {
                      checkMerged(Boolean(get(repoInfo, 'settingUp', '')))
                    }}
                  >
                    {
                      get(repoInfo, 'settingUp', '') && "Already Merged PR, "
                    }
                    Go App Detail
                  </Button>
                  {
                    !prMerged && <div className={styles.mrError}>Please merge Pull Request first</div>
                  }
                </div>
              }
            </div>
          </div>
        }
        <div id="TERMINAL"
             className={styles.terminal}
        >
        </div>
      </div>
    </Layout>
  )
}

export default CreatingApplication
