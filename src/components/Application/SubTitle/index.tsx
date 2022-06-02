import { Typography } from "@mui/material";
import { typographyVariant } from "@mui/system";
import React, { ReactElement } from "react";

import styles from "./index.module.scss";

interface Props {
  variant: "h5";
  require?: boolean;
  children?: string | ReactElement | ReactElement[];
}

export default function SubTitle({
  variant,
  require,
  children,
}: Props): React.ReactElement {
  return (
    <Typography variant={variant} className={styles.subTitle}>
      {children}
      {require && <span className={styles.require}>*</span>}
    </Typography>
  );
}
