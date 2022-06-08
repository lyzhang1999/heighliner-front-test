import React, {useState, useEffect} from 'react';
import {Button} from '@mui/material';
import '@/utils/axios';

import Layout from "@/components/Layout";
import NewGitHubToken from "@/components/Application/VersionControlInfo/NewGitHubToken";
import DeleteIcon from '@mui/icons-material/Delete';

import styles from './index.module.scss';
import {getProviderList, deleteProviderList, GitProviderType} from "@/utils/api/gitProvider";

const Clusters = () => {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [prividerList, setProviderList] = useState<GitProviderType[]>([]);

  function successCb() {
    getProvider();
  }

  useEffect(() => {
    getProvider()
  }, [])

  function getProvider() {
    getProviderList().then(res => {
      setProviderList(res);
    })
  }

  function deleteProvider(id: number) {
    deleteProviderList(id).then(res => {
      getProvider()
    })
  }

  return (
    <Layout pageHeader="GIT PROVIDER">
      <div className={styles.wrapper}>
        <div className={styles.card} onClick={() => setModalDisplay(!modalDisplay)} key="0">
          <Button
            variant="outlined"
          >
            Create a Git Provider
          </Button>
        </div>
        {
          prividerList.map(item => {
            return (
              <div className={styles.card} key={item.git_org_name}>
                <div className={styles.delete}>
                  <DeleteIcon onClick={() => deleteProvider(item.id)}/>
                </div>
                <div className={styles.clusterName}>{item.git_org_name}</div>
              </div>
            )
          })
        }
      </div>
      <NewGitHubToken
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
