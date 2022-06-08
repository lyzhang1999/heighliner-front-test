import Layout from "@/components/Layout";
import {DOMElement, useEffect, useState} from "react";
import clsx from "clsx";
import {Terminal} from 'xterm';
import styles from "./index.module.scss";
import "xterm/css/xterm.css"
import * as React from "react";

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
  const [number, setNumber] = useState<number>(0);
  const [hasMounted, setHasMounted] = React.useState(false);


  useEffect(() => {
    const initTerminal = async () => {
      const {Terminal} = await import('xterm')

      const term = new Terminal()

      // var term = new Terminal();
      term.open(document.getElementById('terminal'));
      term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $  /nfdshiahufiewo /n  \n' +
        'fhdasuoifhdusaiof/n fhewuoiqhfuiew')
      // var count = 0
      // setInterval(() => {
      //   term.write(String(count))
      //   count++;
      // }, 500)
      // Add logic with `term`
    }
    initTerminal()

    // setTimeout(() => {
    // var term = new Terminal();
    // term.open(document.getElementById('terminal'));
    // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
    // }, 3000)


    let timer = setInterval(() => {
      setNumber((value) => {
        return value + 1;
      })
    }, 3000)
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
    <Layout pageHeader="Creating Application">
      <div id="creatingTerminal" className={styles.wrapper}>

        <div id="terminal" style={{width: '300px', height: '300px'}}
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

