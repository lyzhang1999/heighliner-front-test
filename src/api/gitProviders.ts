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

// interface GitProviderItemCommonFields extends CreativeApiReturnField {
//   created_by_name: string;
//   git_org_name: string;
//   id: number;
//   org_id: number;
//   provider: GitProvider;
// }

// export interface GitProviderItemForPAT extends GitProviderItemCommonFields {
//   type: GitProviderType.PAT;
//   personal_access_token: string;
// }

// export interface GitProviderItemForGitHubApp
//   extends GitProviderItemCommonFields {
//   type: GitProviderType.GitHubApp;
//   installation_id: number;
// }

// export interface GitProviderItemForGitHubOAuthApp
//   extends GitProviderItemCommonFields {
//   type: GitProviderType.GitHubOAuth;
//   code: number;
// }

// export type GitProviderItem =
//   | GitProviderItemForPAT
//   | GitProviderItemForGitHubApp
//   | GitProviderItemForGitHubOAuthApp;
export interface GitProviderItem extends CreativeApiReturnField {
  created_by_name: string;
  git_org_name: string;
  git_provider_id: number;
  provider: string;
  type: string;
  user_id: number;
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

export const createGitProvider = (req: CreateGitProviderReq) => {
  return http.post(`/user/git_providers`, req);
};

export const deleteGitProvider = (
  gitProviderId: number
): Promise<GitProviderType[]> => {
  return http.delete(
    `/orgs/${getOriIdByContext()}/git_providers/${gitProviderId}`
  );
};
