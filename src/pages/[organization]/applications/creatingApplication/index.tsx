import Layout from "@/components/Layout";
import {useEffect} from "react";
import {Terminal} from 'xterm';
import styles from "./index.module.scss";
import {isBrowser} from "@/utils/utils";
import "xterm/css/xterm.css"

const CreatingApplication = () => {

  useEffect(() => {
    console.warn('222')
    if(isBrowser()){
      setTimeout(() => {
        console.warn('---')
        console.warn(document.getElementById('creatingTerminal'))
        // term.open(document.getElementById('creatingTerminal'));
        // var term = new Terminal();

        // term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ')
      }, 1000)
    }

  }, [])

  return (
    <Layout pageHeader="CreatingApplication">
      <div id="creatingTerminal" className={styles.wrapper}>

        <div className={styles.timeLine}>
          <div className={styles.circleWrapper}>
            <div className={styles.circle}>

              <div className={styles.circlePoint}></div>
            </div>
          </div>
          <div className={styles.circle}>

            <div className={styles.circlePoint}></div>
          </div>
          <div className={styles.line}></div>
          <div className={styles.circle}></div>
          <div className={styles.line}></div>
          <div className={styles.circle}></div>
          <div className={styles.line}></div>

        </div>

      </div>
    </Layout>
  )
}


export default CreatingApplication
// http://localhost/2/applications/creatingApplication

