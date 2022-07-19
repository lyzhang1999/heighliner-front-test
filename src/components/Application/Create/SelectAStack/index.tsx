import { FieldsMap } from "@/pages/[organization]/applications/create";
import React from "react";
import { Control, Controller } from "react-hook-form";

import styles from "./index.module.scss";

interface Props {
  control: Control;
}

export default function SelectAStack(props: Props): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <Controller
        name={FieldsMap.name}
        control={props.control}
        render={({ field }) => <div className={styles.nameWrap}></div>}
      />
      <div className={styles.stackWrap}></div>
    </div>
  );
}
