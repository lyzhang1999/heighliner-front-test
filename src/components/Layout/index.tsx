import react, {ReactElement} from 'react';
import Menu from './Menu';
import clsx from "clsx";
import Btn from "@/components/Btn";
import styles from './index.module.scss';

interface HomeProps {
  children?: react.ReactNode,
  hiddenContent?: boolean,
  pageHeader?: string,
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
