/**
 * @deprecate This api is deprecated.
 */

import http from '@/utils/axios';
import {getOriIdByContext} from "@/utils/utils";

/**
 * @deprecated Use newest gitProviders api
 */
export enum GitHubProvider {
  GITHUB = "GITHUB"
}

/**
 * @deprecated Use newest gitProviders api
 */
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

/**
 * @deprecated Use newest gitProviders api
 */
export type GitProviders = GitProviderType[];

/**
 * @deprecated Use newest gitProviders api
 */
export const getGitProviderList = (): Promise<GitProviderType[]> => {
  return http.get(`/orgs/${getOriIdByContext()}/git_tokens`);
}

/**
 * @deprecated Use newest gitProviders api
 */
interface CreateProviderReq {
  "git_org_name": string;
  "provider": string;
  "token": string;
}

/**
 * @deprecated Use newest gitProviders api
 */
export const createProviderList = (req: CreateProviderReq): Promise<GitProviderType[]> => {
  return http.post(`/orgs/${getOriIdByContext()}/git_tokens`, req);
}

/**
 * @deprecated Use newest gitProviders api
 */
export const deleteProviderList = (id: number): Promise<GitProviderType[]> => {
  return http.delete(`/orgs/${getOriIdByContext()}/git_tokens/${id}`);
}
