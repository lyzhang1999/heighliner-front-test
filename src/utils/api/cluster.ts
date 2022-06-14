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
}

export type Clusters = ClusterItem[];

interface Cluser{
  data: ClusterItem[],
  pagination: Page
}

export const getClusterList = (): Promise<Cluser> => {
  return http.get(`/orgs/${getOriIdByContext()}/clusters`);
}

export interface CreateClusterReq {
  "kubeconfig": string,
  "name": string,
  "provider": string
}

export const createCluster = (req: CreateClusterReq): Promise<null> => {
  return http.post(`/orgs/${getOriIdByContext()}/clusters`, req)
}






