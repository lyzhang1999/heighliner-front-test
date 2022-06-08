import React, {useState, useEffect} from 'react';
import {Button} from '@mui/material';
import '@/utils/axios';

import Layout from "@/components/Layout";
import NewClusterModal from "@/components/NewClusterModal";

import styles from './index.module.scss';
import {ClusterItem} from "@/utils/api/cluster";
import {getClusterList} from "@/utils/api/cluster";

const Clusters = () => {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [clusterList, setClusterList] = useState<ClusterItem[]>([]);

  function successCb(params: any) {
    getCluster();
  }

  useEffect(() => {
    getCluster()
  }, [])

  function getCluster() {
    getClusterList().then(res => {
      setClusterList(res);
    })
  }

  return (
    <Layout pageHeader="CLUSTERS">
      <div className={styles.wrapper}>
        <div className={styles.card} onClick={() => setModalDisplay(!modalDisplay)}>
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
          setModalDisplay,
          modalDisplay,
          successCb,
        }}
      />
    </Layout>
  )
}
export default Clusters;
// http://localhost/xxx/clusters
