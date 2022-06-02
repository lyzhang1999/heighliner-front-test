import Layout from "@/components/Layout";
import {useEffect, useState} from "react";
import clsx from "clsx";
import {Terminal} from 'xterm';
import styles from "./index.module.scss";
import "xterm/css/xterm.css"

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

  useEffect(() => {
    let timer = setInterval(() => {
      setNumber((value) => {
        return value + 1;
      })
    }, 3000)
    return () => {
      clearInterval(timer);
    }
  }, [])


  return (
    <Layout pageHeader="Creating Application">
      <div id="creatingTerminal" className={styles.wrapper}>


        <div className={styles.timeLine}>
          {
            list.map((item, index) => {
              return (
                <div key={index} className={styles.lineItem}>
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
                      <div>{item.desc}...</div>
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
// http://localhost/2/applications/creatingApplication

