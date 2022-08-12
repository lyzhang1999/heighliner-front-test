import http from "@/utils/axios";
import {getOriIdByContext} from "@/utils/utils";
import { CreativeApiReturnField } from "../utils/commonType";

export enum ClusterProvider {
  Kubeconfig = "kubeconfig",
  AWS = "AWS",
  Free = "freeCluster",
}

export enum ClusterStatus {
  "ACTIVE" = "Active",
  "INITIALIZING" = "Initializing",
  "INACTIVE" = "Inactive",
  "EXPIRED" = "Expired"
}

export interface ClusterItem extends CreativeApiReturnField{
  id: number;
  name: string;
  org_id: number;
  provider: ClusterProvider;
  kubeconfig: string;
  status: ClusterStatus;
  created_by_name: string,
  expire_at: number;
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
  provider?: string;
  ingress_lb_address?: string;
}

export const createCluster = (req: CreateClusterReq): Promise<null> => {
  return http.post(`/orgs/${getOriIdByContext()}/clusters`, req);
};

export const deleteCluster = (id: number): Promise<null> => {
  return http.delete(`/orgs/${getOriIdByContext()}/clusters/${id}`);
};
