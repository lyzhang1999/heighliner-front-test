/**
 * Cluster hooks
 */

import React, { useState, useEffect } from "react";
import {
  ClusterItem,
  getClusterList,
} from "@/api/cluster";

export const useClusterList = (): [ClusterItem[], () => void] => {
  const [clusterList, setClusterList] = useState<ClusterItem[]>([]);

  function getClusters() {
    getClusterList().then(res => {
      setClusterList(res);
    })
  }

  useEffect(() => {
    getClusters()
  }, [])

  return [clusterList, getClusters]
}
