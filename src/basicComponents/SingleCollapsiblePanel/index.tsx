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
  const [height, setHeight] = useState<string>("0px");

  const [isExpand, setIsExpanded] = useState(defaultIsExpanded);

  const collapseChange = () => {
    if (isExpand) {
      setHeight(ref.current?.clientHeight + "px" ?? "0px");
      requestAnimationFrame(() => {
        setHeight(0 + "px");
      });
    } else {
      setHeight(ref.current?.clientHeight + "px" ?? "0px");
      // Consider children heigh will change.
      setTimeout(() => {
        setHeight("auto");
      }, 150);
    }
    setIsExpanded(!isExpand);
  };

  useEffect(() => {
    if (defaultIsExpanded) {
      setHeight(ref.current?.clientHeight + "px" ?? "0px");
      setTimeout(() => {
        setHeight("auto");
      }, 242);
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
          height: height,
        }}
      >
        <div ref={ref}>{children}</div>
      </div>
    </div>
  );
}
