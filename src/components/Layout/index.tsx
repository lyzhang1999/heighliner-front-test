import react, {ReactElement, useState} from 'react';

import Header from './Header';
import Slider from './Slider';
import Menu from './Menu';

import styles from './index.module.scss';

interface HomeProps {
  children?: react.ReactNode,
  hiddenContent?: boolean,
  pageHeader?: string,
  titleContent?: ReactElement,
  CustomSlider?: ReactElement,
  rightBtnDesc?: string,
  rightBtnCb?: () => void
}

const Layout = ({
                  children,
                  hiddenContent,
                  pageHeader,
                  titleContent,
                  CustomSlider,
                  rightBtnDesc,
                  rightBtnCb
                }: HomeProps): react.ReactElement => {
  return (
    <div>
      <div className={styles.contentWrappper}>
        <div className={styles.content}>
          <div className={styles.left}>
            <Menu/>
          </div>
          <div className={styles.right}>
            {
              pageHeader &&
              <div className={styles.pageHeader}>
                {pageHeader}
                {
                  titleContent && titleContent
                }
                {
                  rightBtnDesc &&
                  <div className={styles.rightBtn} onClick={rightBtnCb}>
                    {rightBtnDesc}
                  </div>
                }
              </div>
            }
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Layout;
