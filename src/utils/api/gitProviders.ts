import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";

export enum GitProvider {
  GitHub = "GitHub",
}

export enum GitProviderType {
  PAT = "PAT",
  GitHubApp = "GitHubApp",
}

export interface GitProviderItem {
  created_at: number;
  created_by: number;
  created_by_name: string;
  git_org_name: string;
  id: number;
  installation_id: number;
  org_id: number;
  personal_access_token: string;
  provider: GitProvider;
  type: GitProviderType;
}

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
