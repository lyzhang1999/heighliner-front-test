import http from '@/utils/axios';
import {getOrganizationByUrl} from "@/utils/utils";

export interface ClusterItem {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  org_id: number;
  provider: string;
  kubeconfig: string;
}

export type Clusters = ClusterItem[];

export const getClusterList = (): Promise<ClusterItem[]> => {
  return http.get(`/orgs/${getOrganizationByUrl()}/clusters`);
}

export interface CreateClusterReq {
  "kubeconfig": string,
  "name": string,
  "provider": string
}

export const createCluster = (req: CreateClusterReq): Promise<null> => {
  return http.post(`/orgs/${getOrganizationByUrl()}/clusters`, req)
}



