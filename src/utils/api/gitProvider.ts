import http from '@/utils/axios';
import {getOriIdByContext} from "@/utils/utils";

export enum GitHubProvider{
  GITHUB = "GITHUB"
}

export interface GitProviderType {
  "created_at": number;
  "git_org_name": string;
  "id": number;
  "name": string;
  "org_id": number;
  "provider": GitHubProvider;
  "token": string;
  "updated_at": number
}

export type GitProviders = GitProviderType[];


export const getGitProviderList = (): Promise<GitProviderType[]> => {
  return http.get(`/orgs/${getOriIdByContext()}/git_tokens`);
}

interface CreateProviderReq {
  "git_org_name": string;
  // "name": string;
  "provider": string;
  "token": string;
}

export const createProviderList = (req: CreateProviderReq): Promise<GitProviderType[]> => {
  return http.post(`/orgs/${getOriIdByContext()}/git_tokens`, req);
}

export const deleteProviderList = (id: number): Promise<GitProviderType[]> => {
  return http.delete(`/orgs/${getOriIdByContext()}/git_tokens/${id}`);
}
