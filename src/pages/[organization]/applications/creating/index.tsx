import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import {Terminal} from 'xterm';
import styles from "./index.module.scss";
import "xterm/css/xterm.css"
import * as React from "react";
// import { FitAddon } from 'xterm-addon-fit';

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
      const {FitAddon} = await import('xterm-addon-fit');
      const fitAddon = new FitAddon();
      const term = new Terminal({
        // rendererType: 'dom',
        fontFamily: "Monaco,Menlo,Consolas,Courier New,monospace",
        fontSize: 14,
      })
      term.loadAddon(fitAddon);


      // var term = new Terminal();
      // @ts-ignore
      term.open(document.getElementById('terminal'));
      fitAddon.fit();

      // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $  /nfdshiahufiewo /n  \n' +
      //
      //   'fhdasuoifhdusaiof/n fhewuoiqhfuiew'
      // )

      term.onData((val) => {
        console.warn(val)
        term.write(val);
      });

      // term.onData(recv => term.write(recv));
      term.onData(send => term.write(send));
      // var count = 0
      // setInterval(() => {
      //   term.write(String(count))
      //   count++;
      // }, 500)
      // Add logic with `term`
      //
      // let timer = setInterval(() => {
      //   // setNumber((value) => {
      //   //   return value + 1;
      //   // })
      //   console.warn('---')
      //   term.write("\n");
      //   term.write("123");
      // }, 3000)
      // return () => {
      //   clearInterval(timer);
      // }



      var stream = new EventSource("http://192.168.0.148:8000/orgs/1/applications/7/releases/7/logs");
      stream.addEventListener("MESSAGE", function (e) {
        console.log(e.data);
        term.writeln(e.data);
      });

    }
    setTimeout(() => {
      initTerminal()
    }, 100)


  }, [])

  // close server render
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;


  return (
    <Layout pageHeader="Creating Application">
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

