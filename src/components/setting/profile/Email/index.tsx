import { Button } from "@mui/material";
import React from "react";

import styles from "./index.module.scss";

export default function Email(): React.ReactElement {
  return (
    <div className={styles.emailWrapper}>
      <h2>Email Address</h2>
      <p>Jack23023@gaml.com</p>
      <Button>Edit</Button>
    </div>
  );
}
