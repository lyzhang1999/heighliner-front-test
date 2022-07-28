import React, {
  MouseEventHandler,
  ReactElement,
  useRef,
  useState,
} from "react";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";

interface Props extends CommonProps {
  tabs: Array<{
    icon: ReactElement;
    content: ReactElement;
  }>;
  leftSideTopStatus?: ReactElement;
  hoverTools?: ReactElement;
}

export default function LeftSideTabs(props: Props): React.ReactElement {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const hoverToolsEle = useRef(null);

  const handleChangeSelectedIndex = (index: number) => {
    return () => {
      if (selectedIndex === index) return;
      setSelectedIndex(index);
    };
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.hoverTools} ref={hoverToolsEle}>
        {props.hoverTools}
      </div>
      <div className={styles.wrap}>
        <ul className={styles.leftSide}>
          {props.leftSideTopStatus}
          {props.tabs.map((tab, index) => (
            <li
              key={index}
              onClick={handleChangeSelectedIndex(index)}
              className={clsx(selectedIndex === index && styles.selected)}
            >
              {tab.icon}
            </li>
          ))}
        </ul>
        <div>{props.tabs[selectedIndex].content}</div>
      </div>
    </div>
  );
}
