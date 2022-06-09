import http from "../axios";
import { getOriginzationByUrl } from "../utils";

export interface Token {
  git_org_name: string;
  id: number;
  name: string;
  org_id: number;
  provider: string;
  token: string;
  created_at?: number;
  updated_at?: number;
}

export type TokenList = Token[];

export const getGitHubTokenList = (): Promise<Token[]> => {
  return http.get(`/orgs/${getOriginzationByUrl()}/git_tokens`);
};

export const addGitHubToken = (newToken: Token): Promise<never> => {
  return http.post(`/orgs/${getOriginzationByUrl()}/git_tokens`, {
    git_org_name: newToken.git_org_name,
    provider: newToken.provider,
    token: newToken.token,
  });
};