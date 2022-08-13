import React, {MouseEvent,useContext, useState} from "react";
import { Drawer, Tab } from '@mui/material';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import CloseIcon from '@mui/icons-material/Close';
import {Context} from "@/utils/store";
import { KubeconfigPanel } from "./Kubeconfig";
import { FreeClusterPanel } from "./FreeCluster";
import { CloudHostedPanel } from "./CloudHosted";

import styles from './index.module.scss';

interface Props {
  modalDisplay: boolean,
  setModalDisplay: (dispaly: any) => void,
  successCb?: () => void,
}

enum ClusterTypeEnums {
  FREE = "0",
  CLOUD_HOSTED = "1",
  KUBECONFIG = "2",
}

const NewClusterModal = ({modalDisplay, setModalDisplay, successCb}: Props) => {
  const [clusterType, setClusterType] = useState<ClusterTypeEnums>(ClusterTypeEnums.FREE)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const {state, dispatch} = useContext(Context);
  function handleChangeClusterType(e: React.SyntheticEvent, n: ClusterTypeEnums) {
    setClusterType(n)
  }

  function closeDialog(event: MouseEvent) {
    setModalDisplay(false);
    event.stopPropagation();
  }

  return (
    <div>
      <Drawer
        anchor="right"
        open={modalDisplay}
      >
        <div className={styles.drawerWrap}>
          <div className={styles.closeIcon} title="Close">
            <CloseIcon onClick={closeDialog} />
          </div>
          <div className={styles.header}>
            Add a Kubernetes cluster
          </div>
          <TabContext value={clusterType}>
            <TabList onChange={handleChangeClusterType}>
              <Tab disableRipple label="Free Cluster" value={ClusterTypeEnums.FREE} />
              <Tab disableRipple label="Cloud Provider" value={ClusterTypeEnums.CLOUD_HOSTED} />
              {location.pathname.startsWith("/forkmain-dev/") ||location.pathname.startsWith("/admin/")   ? <Tab disableRipple label="Kubernetes" value={ClusterTypeEnums.KUBECONFIG} /> : ""}
            </TabList>
            <TabPanel value={ClusterTypeEnums.FREE}>
              <FreeClusterPanel {...{ modalDisplay, successCb, isAvailable: true }} />
            </TabPanel>
            <TabPanel value={ClusterTypeEnums.CLOUD_HOSTED}>
              <CloudHostedPanel />
            </TabPanel>
            <TabPanel value={ClusterTypeEnums.KUBECONFIG}>
              <KubeconfigPanel {...{ modalDisplay, successCb }} />
            </TabPanel>
          </TabContext>
        </div>
      </Drawer>
    </div>
  )
}

export default NewClusterModal;
