import http from "../utils/axios";
import { CreativeApiReturnField } from "../utils/commonType";
import {getOriIdByContext} from "../utils/utils";

export interface CreateApplicationRequest {
  cluster_id: number;
  git_config: {
    git_provider_id: number;
  };
  name: string;
  networking?: {
    domain: string;
  };
  stack_id: number;
}

export interface CreateApplicationResponse {
  app_id: number;
  release_id: number;
}

export function createApplication(
  createApplicationRequest: CreateApplicationRequest
): Promise<CreateApplicationResponse> {
  return http.post(
    `/orgs/${getOriIdByContext()}/applications`,
    createApplicationRequest
  );
}

export interface GetApplicationReq {
  app_id: string;
  release_id: string;
}

export enum ApplicationStatus {
  COMPLETED = "Completed",
  PROCESSING = "Processing",
  FAILED = "Failed",
}

export interface GetApplicationStatusRes extends CreativeApiReturnField{
  id: number;
  application_id: number;
  name: string;
  namespace: string;
  cluster_id: number;
  job_namespace: string;
  start_time: number;
  completion_time: number;
  status: ApplicationStatus;
}

export function getApplicationStatus(req: GetApplicationReq): Promise<GetApplicationStatusRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/releases/${
      req.release_id
    }`
  );
}


export interface Last_release extends CreativeApiReturnField{
  id: number;
  application_id: number;
  name: string;
  namespace: string;
  cluster_id: number;
  job_namespace: string;
  start_time: number;
  completion_time: number;
  status: ApplicationStatus;
}

export interface Stack {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  url: string;
  version: string;
}

export interface ApplicationObject {
  app_id: number;
  app_name: string;
  last_release: Last_release;
  stack: Stack;
  owner_id: number,
  owner_name: string,
}

export interface getAppListReq {
  cluster_ids?: number[],
  owner_ids?: number[],
  stack_ids?: number[]
}

export function getApplicationList(params: getAppListReq = {}): Promise<ApplicationObject[]> {
  let {cluster_ids = [], owner_ids = [], stack_ids = []} = params;
  let url = `/orgs/${getOriIdByContext()}/applications?`;
  cluster_ids.forEach((item) => {
    url += `cluster_ids=${item}&`
  })
  owner_ids.forEach((item) => {
    url += `owner_ids=${item}&`
  })
  stack_ids.forEach((item) => {
    url += `stack_ids=${item}&`
  })
  return http.get(url);
}

export interface GetAppEnvironmentsReq {
  org_id: number;
  app_id: number;
}

export type WorkloadType =
  | "Deployment"
  | "StatefuleSet"
  | "DaemonSet"
  | "Job"
  | "CronJob"
  | "Pod";

export type GetAppEnvironmentsRes = Array<{
  cluster: {
    created_at: number;
    id: number;
    in_cluster: boolean;
    kubeconfig: string;
    name: string;
    org_id: number;
    provider: string;
    updated_at: number;
  };
  name: string;
  namespace: string;
  resources: Array<{
    name: string;
    namespace: string;
    ready_total: number;
    total: number;
    type: WorkloadType;
  }>;
  space: {
    access: {
      previewURL: string;
    };
    chart: {
      defaultBranch: string;
      path: string;
      type: string;
      url: string;
      valuesFile: string;
      version: string;
    };
    name: string;
    namespace: string;
  };
  status: "Active";
}>;

export function getAppEnvironments(
  req: GetAppEnvironmentsReq
): Promise<GetAppEnvironmentsRes> {
  return http.get(
    `/orgs/${req.org_id}/applications/${req.app_id}/environments`
  );
}

export interface GetApplicationInfoReq {
  org_id: number;
  app_id: number;
}

export interface GetApplicationInfoRes extends CreativeApiReturnField{
  cluster_id: number;
  domain: string;
  git_org_name: string;
  git_provider: string;
  git_token: string;
  id: number;
  name: string;
  org_id: number;
  stack_id: number;
}

export function getApplicationInfo(
  req: GetApplicationInfoReq
): Promise<GetApplicationInfoRes> {
  return http.get(`/orgs/${req.org_id}/applications/${req.app_id}`);
}

export type GetRepoListRes = Array<{
  "git_organization": string,
  "provider": string,
  "repo_name": string,
  "repo_type": string,
  "repo_url": string
}>

export function getRepoList(appId: string): Promise<GetRepoListRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${appId}/repositorys`
  );
}

export function deleteApplication(appId: number): Promise<any>{
  return http.delete(`/orgs/${getOriIdByContext()}/applications/${appId}`);
}

