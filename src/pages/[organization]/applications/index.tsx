import React, { useState, useEffect } from "react";
import { Button } from "@mui/material";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

import Layout from "@/components/Layout";

import styles from "./index.module.scss";
import http from "@/utils/axios";
import { getOrganizationByUrl } from "@/utils/utils";
import { useRouter } from "next/router";

const Applications = () => {
  const router = useRouter();

  // const [clusterList, setClusterList] = useState([]);
  //
  // function successCb(params: any) {
  //   console.warn(params)
  // }

  useEffect(() => {
    getClusterList();
  }, []);

  function getClusterList() {
    // http.get(`/orgs/${getOrganizationByUrl()}/clusters`).then(res => {
    //   setClusterList(res)
    // })
  }

  return (
    <Layout pageHeader="APPLICATIONS">
      <div className={styles.wrapper}>
        <div className={styles.card} onClick={() => {}}>
          {/*<AddCircleOutlineOutlinedIcon*/}
          {/*  sx={{marginBottom: '20px'}}*/}
          {/*  fontSize="large"*/}
          {/*/>*/}
          <Button
            variant="outlined"
            onClick={() => {
              router.push(
                `/${getOrganizationByUrl()}/applications/create`
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
