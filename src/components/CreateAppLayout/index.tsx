import styles from './index.module.scss';
import {ReactElement} from "react";
import {Button} from "@mui/material";
import { CommonProps } from '@/utils/commonType';

const list = [
  'Select a stack',
  'Providers',
  'Backend',
  "Frontend",
  "Middlewares"
]

interface Props extends CommonProps{
}

export default function CreateAppLayout({children}: Props) {
  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div className={styles.header}>
          <span className={styles.name}>New application</span>
          <span className={styles.currentIndex}>(1 / 5)</span>
          <span className={styles.currentName}>Select a stack</span>
        </div>
        <div className={styles.content}>
          {children}
        </div>
        <div className={styles.footer}>
          <Button
            variant="outlined"
          >
            Back
          </Button>
          <Button
            variant="contained"
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
