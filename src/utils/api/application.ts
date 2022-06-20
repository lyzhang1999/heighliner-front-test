import { AllFieldName, FormData } from "@/components/Application/formData";
import http from "../axios";
import { getOriIdByContext } from "../utils";
import { Page } from "@/utils/api/type";

export interface CreateApplicationRequest {
  cluster_id: number;
  git_config: {
    org_name: string;
    provider: string;
    token: string;
  };
  name: string;
  networking: {
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

export interface GetStatusReq {
  app_id: string;
  release_id: string;
}

export enum ApplicationStatus {
  COMPLETED = "Completed",
  PROCESSING = "Processing",
  FAILED = "Failed",
}

export interface GetStatusRes {
  id: number;
  created_at: number;
  updated_at: number;
  application_id: number;
  name: string;
  namespace: string;
  cluster_id: number;
  job_namespace: string;
  start_time: number;
  completion_time: number;
  status: ApplicationStatus;
}

export function getApplicationStatus(req: GetStatusReq): Promise<GetStatusRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/releases/${
      req.release_id
    }`
  );
}

export interface Last_release {
  id: number;
  created_at: number;
  updated_at: number;
  application_id: number;
  name: string;
  namespace: string;
  cluster_id: number;
  job_namespace: string;
  start_time: number;
  completion_time: number;
  status: string;
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
}

export interface GetApplicationRes {
  data: ApplicationObject[];
  pagination: Page;
}

export function getApplicationList(): Promise<GetApplicationRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications?page=1&page_size=999`
  );
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

export interface GetApplicationInfoRes {
  cluster_id: number;
  created_at: number;
  domain: string;
  git_org_name: string;
  git_provider: string;
  git_token: string;
  id: number;
  name: string;
  org_id: number;
  stack_id: number;
  updated_at: number;
}

export function getApplicationInfo(
  req: GetApplicationInfoReq
): Promise<GetApplicationInfoRes> {
  return http.get(`/orgs/${req.org_id}/applications/${req.app_id}`);
}
