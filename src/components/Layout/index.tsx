import react from 'react';
import {ThemeProvider} from '@mui/material/styles';

import Header from './Header'
import Slider from './Slider'

import theme from './theme.js';
import styles from './index.module.scss';
import dynamic from 'next/dynamic'

const SlinderNoSSR = dynamic(
  () => import('./Slider/index'),
  { ssr: false }
)

interface HomeProps {
  children?: react.ReactNode,
  hiddenContent?: boolean,
  pageHeader?: string
}

const Layout = ({children, hiddenContent, pageHeader}: HomeProps): react.ReactElement => {
  return (
    <ThemeProvider theme={theme}>
      <div className={styles.header}>
        <Header/>
      </div>
      {
        hiddenContent ?
          children
          :
          <div className={styles.contentWrappper}>
            <div className={styles.content}>
              <div className={styles.left}>
                <Slider/>
                {/*<SlinderNoSSR/>*/}
              </div>
              <div className={styles.center}>
                {
                  pageHeader &&
                  <div className={styles.pageHeader}>
                    {pageHeader}
                  </div>
                }
                {children}
              </div>
              <div className={styles.right}>
              </div>
            </div>
          </div>
      }
    </ThemeProvider>
  )
}

export default Layout;
