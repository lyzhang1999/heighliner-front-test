import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";
import { CreativeApiReturnField } from "../utils/commonType";

export enum GitProvider {
  GitHub = "GitHub",
}

export enum GitProviderType {
  PAT = "PAT",
  GitHubApp = "GitHubApp",
}

interface GitProviderItemCommonFields extends CreativeApiReturnField{
  created_by_name: string;
  git_org_name: string;
  id: number;
  org_id: number;
  provider: GitProvider;
}

export interface GitProviderItemForPAT extends GitProviderItemCommonFields {
  type: GitProviderType.PAT;
  personal_access_token: string;
}

export interface GitProviderItemForGitHubApp extends GitProviderItemCommonFields {
  type: GitProviderType.GitHubApp;
  installation_id: number;
}

export type GitProviderItem = GitProviderItemForPAT | GitProviderItemForGitHubApp;

export type GitProviderList = Array<GitProviderItem>;

export const getGitProviderList = (): Promise<GitProviderList> => {
  return http.get(`/orgs/${getOriIdByContext()}/git_providers`);
};

type CreateGitProviderReq =
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
    };

export const createGitProvider =(
  req: CreateGitProviderReq
) => {
  return http.post(`/orgs/${getOriIdByContext()}/git_providers`, req);
};

export const deleteGitProvider = (
  gitProviderId: number
): Promise<GitProviderType[]> => {
  return http.delete(
    `/orgs/${getOriIdByContext()}/git_providers/${gitProviderId}`
  );
};
