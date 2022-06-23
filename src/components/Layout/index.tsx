import react, {ReactElement, useContext, useEffect} from 'react';
import Menu from './Menu';
import clsx from "clsx";
import Btn from "@/components/Btn";
import styles from './index.module.scss';
import {getUserInfo} from "@/utils/api/profile";
import {Context} from "@/utils/store";

interface HomeProps {
  children?: react.ReactNode,
  hiddenContent?: boolean,
  pageHeader?: string,
  CustomSlider?: ReactElement,
  rightBtnDesc?: string,
  rightBtnCb?: () => void,
  notStandardLayout?: boolean
}

const Layout = (props: HomeProps): react.ReactElement => {
  let {children, pageHeader, rightBtnDesc, rightBtnCb, notStandardLayout} = props;
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
            <Menu/>
          </div>
          <div className={clsx(
            styles.right,
          )}>
            <div className={
              clsx(
                styles.rightContent,
                !notStandardLayout && styles.standard
              )
            }>
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
