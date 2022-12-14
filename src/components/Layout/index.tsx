import react, {ReactElement, useContext, useEffect, useState} from 'react';
import {Button, IconButton} from '@mui/material';
import clsx from "clsx";
import ArrowBackSharpIcon from '@mui/icons-material/ArrowBackSharp';

import {getUserInfo} from "@/api/profile";
import {Context} from "@/utils/store";

import Menu from './Menu';
import styles from './index.module.scss';
interface HomeProps {
  children?: react.ReactNode,
  hiddenContent?: boolean,
  pageHeader?: string,
  breadcrumbs?: ReactElement | {
    back: () => void,
    ele: ReactElement
  },
  CustomSlider?: ReactElement,
  rightBtnDesc?: string,
  rightBtnCb?: () => void,
  notStandardLayout?: boolean
}

const Layout = (props: HomeProps): react.ReactElement => {
  let {children, pageHeader, breadcrumbs, rightBtnDesc, rightBtnCb, notStandardLayout} = props;
  const {state, dispatch} = useContext(Context);
  let {hasRenderLayout} = state;
  useEffect(() => {
    if (!hasRenderLayout) {
      // set render loyout flag
      dispatch({hasRenderLayout: true});
      // set userinfo to context
      getUserInfo().then(res => {
        dispatch({userInfo: res})
      })
    }
  }, []);

  return (
    <div>
      <div className={styles.contentWrappper}>
        <div className={styles.content}>
          <div className={styles.left}>
            <Menu />
          </div>
          <div
            className={clsx(
              styles.right
              // styles.horizontalFadeIn
            )}
          >
            <div
              className={clsx(
                styles.rightContent,
                !notStandardLayout && styles.standard
              )}
            >
              {pageHeader && (
                <div className={styles.pageHeader}>
                  {pageHeader}
                  {rightBtnDesc && (
                    <Button onClick={rightBtnCb} variant="contained">
                      {rightBtnDesc}
                    </Button>
                  )}
                </div>
              )}
              {breadcrumbs && !("back" in breadcrumbs) && (
                <div className={styles.breadcrumbs}>{breadcrumbs}</div>
              )}
              {breadcrumbs && "back" in breadcrumbs && (
                <div className={styles.breadcrumbs}>
                  <IconButton onClick={breadcrumbs.back}>
                    <ArrowBackSharpIcon />
                  </IconButton>
                  {breadcrumbs.ele}
                </div>
              )}
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;
