import React, {useState, useEffect} from 'react';
import {Button} from '@mui/material';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import '@/utils/axios';

import Layout from "@/components/Layout";
import NewClusterModal from "@/components/NewClusterModal";

import styles from './index.module.scss';

const Clusters = () => {
  const [modalDisplay, setModalDispay] = useState<boolean>(false);

  function successCb(params: any) {
    console.warn(params)
  }

  return (
    <Layout pageHeader="Cluster">
      <div className={styles.wrapper}>
        <div className={styles.card} onClick={() => setModalDispay(!modalDisplay)}>
          <AddCircleOutlineOutlinedIcon
            sx={{marginBottom: '20px'}}
            fontSize="large"
          />
          <Button
            variant="outlined"
          >
            Create a Cluster
          </Button>
        </div>
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
