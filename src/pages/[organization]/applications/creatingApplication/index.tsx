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
      <div id="creatingTerminal" className={styles.terminal}>
        tewstdfafs
      </div>
    </Layout>
  )
}


export default CreatingApplication

