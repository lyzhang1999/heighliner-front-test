import http from '@/utils/axios';
import {getOriginzationByUrl} from "@/utils/utils";

export interface ClusterItem {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  org_id: number;
  provider: string;
  kubeconfig: string;
}

export const getClusterList = (): Promise<ClusterItem[]> => {
  return http.get(`/orgs/${getOriginzationByUrl()}/clusters`);
}


export interface CreateClusterReq {
  "kubeconfig": string,
  "name": string,
  "provider": string
}

// export const createCluster = (req: CreateClusterReq): Promise<> => {
//   http.post(`/orgs/${getOriginzationByUrl()}/clusters`, req)
// }


