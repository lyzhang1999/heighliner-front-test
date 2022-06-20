import http from '@/utils/axios';
import {getOriIdByContext} from "@/utils/utils";
import {Page} from "@/utils/api/type";

export interface ClusterItem {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  org_id: number;
  provider: string;
  kubeconfig: string;
  status: ClusterStatus,
}

enum ClusterStatus {
  "Active" = "Active",
  "Initializing" = "Initializing",
  "Inactive" = "Inactive",
}

export type Clusters = ClusterItem[];

interface Cluser {
  data: ClusterItem[],
  pagination: Page
}

export const getClusterList = (): Promise<Cluser> => {
  return http.get(`/orgs/${getOriIdByContext()}/clusters?page=1&page_size=999`);
}

export interface CreateClusterReq {
  "kubeconfig": string,
  "name": string,
  "provider": string
}

export const createCluster = (req: CreateClusterReq): Promise<null> => {
  return http.post(`/orgs/${getOriIdByContext()}/clusters`, req)
}

export const deleteCluster = (id: number): Promise<null> => {
  return http.delete(`/orgs/${getOriIdByContext()}/clusters/${id}`)
}







