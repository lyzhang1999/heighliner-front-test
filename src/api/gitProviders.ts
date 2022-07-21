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

export type GitProviderOrganizations = Array<{
  created_at: number;
  created_by: number;
  created_by_name: string;
  git_owner_name: string;
  git_provider_id: number;
  owner_type: string;
  provider: GitProvider;
  type: GitProviderType;
  user_id: number;
}>;

export const getGitProviderOrganizations =
  (): Promise<GitProviderOrganizations> => {
    return http.get(`/user/git_providers/organizations`);
  };
