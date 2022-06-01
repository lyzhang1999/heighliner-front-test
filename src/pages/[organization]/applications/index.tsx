import React, {useState, useEffect} from 'react';
import {Button} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';

import Layout from "@/components/Layout";

import styles from './index.module.scss';
import http from "@/utils/axios";
import {getOriginzationByUrl} from "@/utils/utils";

const Applications = () => {
  // const [clusterList, setClusterList] = useState([]);
  //
  // function successCb(params: any) {
  //   console.warn(params)
  // }

  useEffect(() => {
    getClusterList()
  }, [])

  function getClusterList() {
    http.get(`/orgs/${getOriginzationByUrl()}/clusters`).then(res => {
      // setClusterList(res)
    })
  }

  return (
    <Layout pageHeader="Applications">
      <div className={styles.wrapper}>
        <div className={styles.card} onClick={() => {}}>
          <AddCircleOutlineOutlinedIcon
            sx={{marginBottom: '20px'}}
            fontSize="large"
          />
          <Button
            variant="outlined"
          >
            Create a Application
          </Button>
        </div>
        {/*{*/}
        {/*  clusterList.map(item => {*/}
        {/*    return (*/}
        {/*      <div className={styles.card} key={item.name}>*/}
        {/*        <div className={styles.clusterName}>{item.name}</div>*/}
        {/*      </div>*/}
        {/*    )*/}
        {/*  })*/}
        {/*}*/}
      </div>
    </Layout>
  )
}
export default Applications;
// http://localhost/xxx/clusters
