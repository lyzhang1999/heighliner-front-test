import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";
import { CreativeApiReturnField } from "../utils/commonType";

export enum GitProvider {
  GitHub = "GitHub",
}

export enum GitProviderType {
  PAT = "PAT",
  GitHubApp = "GitHubApp",
  GitHubOAuth = "GitHubOAuthApp",
}

export interface GitProviderItem extends CreativeApiReturnField {
  created_by_name: string;
  git_org_name: string;
  git_provider_id: number;
  provider: string;
  type: string;
  reason: string;
  user_id: number;
  status: number;
}

export type GitProviderList = Array<GitProviderItem>;

export const getGitProviderList = (): Promise<GitProviderList> => {
  return http.get(`/user/git_providers`);
};

export type CreateGitProviderReq =
  | {
      git_org_name: string;
      provider: GitProvider;
      type: GitProviderType.PAT;
      personal_access_token: string;
    }
  | {
      git_org_name: string;
      provider: GitProvider;
      type: GitProviderType.GitHubApp;
      installation_id: number;
    }
  | {
      provider: GitProvider;
      type: GitProviderType.GitHubOAuth;
      code: string;
    };

export interface CreateGitProviderRes extends CreativeApiReturnField {
  access_token: string;
  git_org_name: string;
  id: number;
  installation_id: number;
  org_id: number;
  personal_access_token: string;
  provider: GitProvider;
  type: GitProviderType;
  user_id: number;
}

export const createGitProvider = (
  req: CreateGitProviderReq
): Promise<CreateGitProviderRes> => {
  return http.post(`/user/git_providers`, req);
};

export const deleteGitProvider = (
  gitProviderId: number
): Promise<GitProviderType[]> => {
  return http.delete(`/user/git_providers/${gitProviderId}`);
};

export enum OwnerType {
  Org = "Org",
  User = "User",
}

export type GitProviderOrganizations = Array<{
  created_at: number;
  created_by: number;
  created_by_name: string;
  git_owner_name: string;
  git_provider_id: number;
  owner_type: OwnerType;
  provider: GitProvider;
  type: GitProviderType;
  user_id: number;
}>;

export const getGitProviderOrganizations =
  (): Promise<GitProviderOrganizations> => {
    return http.get(`/user/git_providers/organizations`);
  };

export interface GetBranchesReq {
  git_provider_id: number;
  owner_name: string;
  repo_name: string;
}

export type GetBranchesRes = Array<{
  commit_sha: string;
  commit_url: string;
  name: string;
  protected: true;
}>;

export function getBranches(req: GetBranchesReq): Promise<GetBranchesRes> {
  return http.get(`/user/git_providers/${req.git_provider_id}/repo/branches`, {
    params: {
      owner_name: req.owner_name,
      repo_name: req.repo_name,
    },
  });
}

export interface GetPrListReq {
  owner_name: string;
  repo_name: string;
  git_provider_id: number;
  base_name?: string;
  head_name?: string;
}
export interface Head {
  label: string;
  ref: string;
}

export interface Base {
  label: string;
  ref: string;
}

export type GetPrListRes  = Array<{
  number: number;
  title: string;
  html_url: string;
  state: string;
  head: Head;
  base: Base;
}>

/* 环境详情页面获取 PR 接口中分支信息应该传如 head_name 字段，
  而不是 base_name 字段，并且 head_name 应该采用 {组织名/用户名}:{分支名} 格式，
  详情见 GitHub 官方文档：https://docs.github.com/en/rest/pulls/pulls#list-pull-requests 
*/
export function getPrList(req: GetPrListReq): Promise<GetPrListRes> {
    return http.get(`/user/git_providers/${req.git_provider_id}/repo/pulls`, {
    params: {
      owner_name: req.owner_name,
      repo_name: req.repo_name,
      base_name: req.base_name,
      head_name: req.head_name,
    }
  })
}

// export interface getPrReq extends getPrListReq {
//   base_name: string;
//   head_name?: string;
// }

// export function getPr(req: getPrReq): Promise<GetPrListRes[]>  {
//   return http.get(`/user/git_providers/${req.git_provider_id}/repo/pulls`, {
//     params: {
//       owner_name: req.owner_name,
//       repo_name: req.repo_name,
//       base_name: req.base_name,
//       head_name: req.head_name,
//     }
//   })
// }


interface GetPrStatusReq{
  app_id: string,
  release_id: string,
}

export const getPrStatus = ({app_id, release_id}: GetPrStatusReq): Promise<{merged: boolean}> =>{
  return http.get(`/orgs/${getOriIdByContext()}/applications/${release_id}/releases/${release_id}/pr_merged`);
}
