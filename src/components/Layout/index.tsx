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
}

const Layout = ({children, hiddenContent, pageHeader, titleContent, CustomSlider}: HomeProps): react.ReactElement => {
  return (
    <div>
      {/*<div className={styles.header}>*/}
      {/*  <Header/>*/}
      {/*</div>*/}
      {
        hiddenContent ?
          children
          :
          <div className={styles.contentWrappper}>
            <div className={styles.content}>
              <div className={styles.left}>
                {/*{CustomSlider ?? <Slider/>}*/}
                <Menu/>
              </div>
              <div className={styles.center}>
                {
                  pageHeader &&
                  <div className={styles.pageHeader}>
                    {pageHeader}
                    {
                      titleContent && titleContent
                    }
                  </div>
                }
                {children}
              </div>
            </div>
          </div>
      }
    </div>
  )
}

export default Layout;
