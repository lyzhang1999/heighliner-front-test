import React, { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import { Button } from "@mui/material";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";

interface Props extends CommonProps {
  title?: string;
  defaultIsExpanded?: boolean;
}

export default function SingleCollapsiblePanel(
  props: Props
): React.ReactElement {
  const { title, children, defaultIsExpanded } = props;
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState<number>(0);

  const [isExpand, setIsExpanded] = useState(defaultIsExpanded);

  const collapseChange = () => {
    if (isExpand) {
      setHeight(0);
    } else {
      setHeight(ref.current?.clientHeight ?? 0);
    }
    setIsExpanded(!isExpand);
  };

  useEffect(() => {
    if (defaultIsExpanded) {
      setHeight(ref.current?.clientHeight ?? 0);
    }
  }, []);

  return (
    <div className={styles.wrapper}>
      <div className={styles.title}>{title}</div>
      <Button className={styles.button} onClick={collapseChange}>
        {isExpand ? "Collapse" : "Expand"}
      </Button>
      <div
        className={clsx(styles.content, isExpand && styles.expanded)}
        style={{
          height: height + "px",
        }}
      >
        <div ref={ref}>{children}</div>
      </div>
    </div>
  );
}
