import http from '@/utils/axios';
import {getOriginzationByUrl} from "@/utils/utils";

export interface GitProviderType {
  "created_at": number;
  "github_org_name": string;
  "id": number;
  "name": string;
  "org_id": number;
  "provider": string;
  "token": string;
  "updated_at": number
}


export const getProviderList = (): Promise<GitProviderType[]> => {
  return http.get(`/orgs/${getOriginzationByUrl()}/git_tokens`);
}

interface CreateProviderReq {
  "github_org_name": string;
  // "name": string;
  "provider": string;
  "token": string;
}

export const createProviderList = (req: CreateProviderReq): Promise<GitProviderType[]> => {
  return http.post(`/orgs/${getOriginzationByUrl()}/git_tokens`);
}

export const deleteProviderList = (id: number): Promise<GitProviderType[]> => {
  return http.delete(`/orgs/${getOriginzationByUrl()}/git_tokens/${id}`);
}
