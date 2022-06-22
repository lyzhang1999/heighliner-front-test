import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";
import { Page } from "@/utils/api/type";

export enum ClusterProvider {
  Kubeconfig = "kubeconfig",
  AWS = "AWS",
  Free = "Free",
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
  provider: string;
  kubeconfig: ClusterProvider;
  status: ClusterStatus;
}

export type Clusters = ClusterItem[];

interface ClusterList {
  data: ClusterItem[];
  pagination: Page;
}

interface GetClusterReq {
  // org_id: number;
  cluster_id: number;
}

export const getCluster = (req: GetClusterReq): Promise<ClusterItem> => {
  return http.get(`/orgs/${getOriIdByContext()}/clusters/${req.cluster_id}`);
};

export const getClusterList = (): Promise<ClusterList> => {
  return http.get(`/orgs/${getOriIdByContext()}/clusters?page=1&page_size=999`);
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
