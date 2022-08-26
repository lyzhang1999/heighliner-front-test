import styles from './index.module.scss';
import React, {ReactElement, useContext} from "react";
import {Button} from "@mui/material";
import {CommonProps} from '@/utils/commonType';
import clsx from "clsx";
import {CreateContext} from "@/pages/[organization]/applications/creation/context";

const list = [
  'Select a stack',
  'Providers',
  'Backend',
  "Frontend",
  "Middlewares"
]

interface Props extends CommonProps {
  children?: ReactElement,
  index: number,
  goIndex: (number: number) => void,
  stack: string,
}

export default function CreateAppLayout({children, index, goIndex, stack}: Props) {

  let timelineTitle: string[] = [];

  if (stack === 'web') {
    timelineTitle = [
      'Select a stack',
      'Providers',
      'Backend',
      "Frontend",
      "Middlewares"
    ]
  } else if (stack === 'micro') {
    timelineTitle = [
      'Select a stack',
      'Providers',
      'Setting Service',
      "Network Config",
      "Middlewares"
    ]
  } else {
    timelineTitle = [
      'Select a stack', "", "", "", ""
    ]
  }

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <div className={styles.header}>
            <span className={styles.name}>New application</span>
            <span className={styles.currentIndex}>({index} / 5)</span>
            <span className={styles.currentName}>{timelineTitle[index - 1] || ""}</span>
          </div>
          <div className={styles.content}>
            {children}
          </div>
          <div className={styles.footer}>
            <Button
              variant="outlined"
              onClick={() => goIndex(index - 1)}
              sx={(index === 0) ? {cursor: "not-allowed"} : {}}
            >
              Back
            </Button>
            <Button
              variant="contained"
              onClick={() => goIndex(index + 1)}
              sx={{marginLeft: "30px"}}
              // sx={(index === 5) ? {cursor: "not-allowed"} : {}}
            >
              {
                index === 5 ? "Submit" : "Next"
              }
            </Button>

          </div>
        </div>
        <div className={styles.right}>
          {
            timelineTitle.map((item, i) => {
              return (
                <div key={i} className={clsx(styles.countItem, (i === (index - 1)) && styles.currentItem)}
                  // onClick={() => goIndex(i + 1)}
                >
                  <div className={styles.count}>
                    {
                      (index - 1) > i ?
                        <img src="/img/application/doneIcon.svg" alt=""/>
                        :
                        <span>
                          {i + 1}
                        </span>
                    }
                  </div>
                  <div className={clsx(styles.desc)}>
                    {item}
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}
