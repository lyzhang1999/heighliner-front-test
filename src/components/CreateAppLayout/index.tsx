import styles from './index.module.scss';
import {ReactElement} from "react";
import {Button} from "@mui/material";

const list = [
  'Select a stack',
  'Providers',
  'Backend',
  "Frontend",
  "Middlewares"
]

interface Props {
  children?: ReactElement,
  backCb: () => void,
  nextCb: () => void,
  index: number
}

export default function CreateAppLayout({children, backCb, nextCb, index}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.header}>
          <span className={styles.name}>New application</span>
          <span className={styles.currentIndex}>({index} / 5)</span>
          <span className={styles.currentName}>{list[index - 1]
          }</span>
        </div>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer}>
          <Button
            variant="outlined"
            onClick={backCb}
          >
            Back
          </Button>
          <Button
            variant="contained"
            onClick={nextCb}
          >
            Next
          </Button>
        </div>
      </div>
      <div className={styles.right}>
        {
          list.map((item, index) => {
            return (
              <div key={index} className={styles.countItem}>
                <div className={styles.count}>
                  {index + 1}
                </div>
                <div className={styles.desc}>
                  {item}
                </div>
              </div>
            )
          })
        }
      </div>
    </div>
  )
}
