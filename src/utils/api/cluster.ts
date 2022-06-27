import http from "@/utils/axios";
import {getOriIdByContext} from "@/utils/utils";

export enum ClusterProvider {
  Kubeconfig = "kubeconfig",
  AWS = "AWS",
  Free = "freeCluster",
}

export enum ClusterStatus {
  "Active" = "Active",
  "Initializing" = "Initializing",
  "Inactive" = "Inactive",
}

export interface ClusterItem {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  org_id: number;
  provider: ClusterProvider;
  kubeconfig: string;
  status: ClusterStatus;
  created_by: string,
  created_by_name: string,
}

export type Clusters = ClusterItem[];


export const getClusterList = (): Promise<ClusterItem[]> => {
  return http.get(`/orgs/${getOriIdByContext()}/clusters`);
};

interface GetClusterReq {
  cluster_id: number;
}

export const getCluster = (req: GetClusterReq): Promise<ClusterItem> => {
  return http.get(`/orgs/${getOriIdByContext()}/clusters/${req.cluster_id}`);
};

export interface CreateClusterReq {
  kubeconfig: string;
  name: string;
  provider: string;
}

export const createCluster = (req: CreateClusterReq): Promise<null> => {
  return http.post(`/orgs/${getOriIdByContext()}/clusters`, req);
};

export const deleteCluster = (id: number): Promise<null> => {
  return http.delete(`/orgs/${getOriIdByContext()}/clusters/${id}`);
};
