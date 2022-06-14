import React, {useState, useEffect, useContext} from "react";
import {Button} from "@mui/material";

import Layout from "@/components/Layout";

import styles from "./index.module.scss";
import {useRouter} from "next/router";
import {Context} from "@/utils/store";
import {get} from "lodash-es";

const Applications = () => {
  const router = useRouter();
  let {state} = useContext(Context);

  return (
    <Layout pageHeader="APPLICATIONS">
      <div className={styles.wrapper}>
        <div className={styles.card} onClick={() => {
        }}>
          <Button
            variant="outlined"
            onClick={() => {
              router.push(
                `/${get(state, ['currentOiganization', 'name'], '')}/applications/creation`
              );
            }}
          >
            Create a Application
          </Button>
        </div>
      </div>
    </Layout>
  );
};
export default Applications;
// http://localhost/xxx/clusters
