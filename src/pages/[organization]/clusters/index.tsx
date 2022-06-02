import React, {useState, useEffect} from 'react';
import {Button} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import '@/utils/axios';

import Layout from "@/components/Layout";
import NewClusterModal from "@/components/NewClusterModal";

import styles from './index.module.scss';
import http from "@/utils/axios";
import {getOriginzationByUrl} from "@/utils/utils";

const Clusters = () => {
  const [modalDisplay, setModalDispay] = useState<boolean>(false);
  const [clusterList, setClusterList] = useState([]);

  function successCb(params: any) {
    getClusterList();
  }

  useEffect(() => {
    getClusterList()
  }, [])

  function getClusterList() {
    http.get(`/orgs/${getOriginzationByUrl()}/clusters`).then(res => {
      setClusterList(res)
    })
  }

  return (
    <Layout pageHeader="CLUSTERS">
      <div className={styles.wrapper}>
        <div className={styles.card} onClick={() => setModalDispay(!modalDisplay)}>
          {/*<AddBoxOutlinedIcon*/}
          {/*  sx={{marginBottom: '20px',  color: "#ba77ff"}}*/}

          {/*  fontSize="large"*/}
          {/*/>*/}
          {/*import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';*/}
          <Button
            variant="outlined"
          >
            Create a Cluster
          </Button>
        </div>
        {
          clusterList.map(item => {
            return (
              <div className={styles.card} key={item.name}>
                <div className={styles.clusterName}>{item.name}</div>
              </div>
            )
          })
        }
      </div>
      <NewClusterModal
        {...{
          setModalDispay,
          modalDisplay,
          successCb,
        }}
      />
    </Layout>
  )
}
export default Clusters;
// http://localhost/xxx/clusters
