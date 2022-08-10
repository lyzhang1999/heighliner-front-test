import http from "@/utils/axios";
import { CreativeApiReturnField } from "@/utils/commonType";
import { getOriIdByContext } from "@/utils/utils";

export interface CreateEnvGitHubIssueReq {
  app_id: number;
  env_id: number;
  body: {
    issue_url: string;
  };
}

export function createEnvGitHubIssue(req: CreateEnvGitHubIssueReq) {
  return http.post(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/envs/${
      req.env_id
    }/github_issues`,
    req.body
  );
}

export type GetEnvGitHubIssuesRes = Array<{
  issue_num: string;
  organization: string;
  repo_name: string;
  title: string;
  url: string;
}>;

export function getEnvGitHubIssues({
  app_id,
  env_id,
}: {
  app_id: number;
  env_id: number;
}): Promise<GetEnvGitHubIssuesRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/envs/${env_id}/github_issues`
  );
}

export interface UpdateEnvGitHubIssueReq {
  app_id: number;
  env_id: number;
  body: {
    issue_urls: Array<string>;
  };
}
export function updateEnvGitHubIssue(req: UpdateEnvGitHubIssueReq) {
  return http.put(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/envs/${
      req.env_id
    }/github_issues`,
    req.body
  );
}

export interface DeleteEnvGitHubIssueReq {
  app_id: number;
  env_id: number;
}

export function deleteEnvGitHubIssue(req: DeleteEnvGitHubIssueReq) {
  return http.delete(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/envs/${
      req.env_id
    }/github_issues`
  );
}
