import react, {ReactElement, useState} from 'react';

import Menu from './Menu';

import styles from './index.module.scss';
import clsx from "clsx";
import Btn from "@/components/Btn";

interface HomeProps {
  children?: react.ReactNode,
  hiddenContent?: boolean,
  pageHeader?: string,
  // titleContent?: ReactElement,
  CustomSlider?: ReactElement,
  rightBtnDesc?: string,
  rightBtnCb?: () => void,
  notStandardLayout?: boolean
}

const Layout = ({
                  children,
                  pageHeader,
                  rightBtnDesc,
                  rightBtnCb,
                  notStandardLayout
                }: HomeProps): react.ReactElement => {
  return (
    <div>
      <div className={styles.contentWrappper}>
        <div className={styles.content}>
          <div className={styles.left}>
            <Menu/>
          </div>
          <div className={clsx(
            styles.right,
            !notStandardLayout && styles.standard
          )}>
            <div className={styles.rightContent}>
              {
                pageHeader &&
                <div className={styles.pageHeader}>
                  {pageHeader}
                  {
                    rightBtnDesc &&
                    <Btn onClick={rightBtnCb}>
                      {rightBtnDesc}
                    </Btn>
                  }
                </div>
              }
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;
