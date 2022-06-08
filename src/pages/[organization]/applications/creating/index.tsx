import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {Terminal} from 'xterm';
import styles from "./index.module.scss";
import "xterm/css/xterm.css"
import * as React from "react";
import {trim} from "lodash-es";
// import { FitAddon } from 'xterm-addon-fit';
// import * as fit from 'xterm/lib/addons/fit';


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


  useEffect(() => {
    const initTerminal = async () => {
      const {Terminal} = await import('xterm')
      const {FitAddon} = await import('xterm-addon-fit');
      const fitAddon = new FitAddon();
      const term = new Terminal({
        fontFamily: "Monaco,Menlo,Consolas,Courier New,monospace",
        fontSize: 14,
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

      var stream = new EventSource("http://192.168.0.148:8000/orgs/1/applications/7/releases/7/logs");
      stream.addEventListener("MESSAGE", function (e) {
        term.writeln(e.data);
      });
      stream.addEventListener("END", function (e) {
        stream.close();
      });
    }

    // setTimeout(() => {
    initTerminal()
    // }, 100)
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
      </div>
    </Layout>
  )
}


export default CreatingApplication
// http://localhost/2/applications/creating

