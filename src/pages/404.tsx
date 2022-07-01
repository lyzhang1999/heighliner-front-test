import styles from './404.module.scss';
import {useEffect, useState} from "react";

export default function Page404() {
  const [count, seCount] = useState<number>(5);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (count === 0) {
        clearTimeout(timer);
        goHome();
        return;
      }
      seCount(count - 1);
    }, 1000)
    return () => {
      clearTimeout(timer);
    }
  }, [count])

  function goHome() {
    location.pathname = "/";
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.content}>
        <div className={styles.count}>
          404
        </div>
        <div className={styles.desc}>
          sorry, the page 404, auto go <span onClick={goHome}
                                             className={styles.home}>home</span> after <span>{count}</span>s
        </div>
      </div>
    </div>
  )
}

