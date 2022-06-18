import {AllFieldName, FormData} from "@/components/Application/formData";
import http from "../axios";
import { getOriIdByContext } from "../utils";
import {Page} from "@/utils/api/type";

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

interface GetStatusReq {
  app_id: string,
  release_id: string
}

export enum ApplicationStatus {
  COMPLETED = "Completed",
  PROCESSING = "Processing",
  FAILED = "Failed"
}

interface GetStatusRes {
  status: ApplicationStatus
}

export function getApplicationStatus(req: GetStatusReq): Promise<GetStatusRes> {
  return http.get(`/orgs/${getOriIdByContext()}/applications/${req.app_id}/releases/${req.release_id}`)
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

export interface GetApplicationRes{
  data: ApplicationObject[],
  pagination: Page
}

export function getApplicationList(): Promise<GetApplicationRes> {
  return http.get(`/orgs/${getOriIdByContext()}/applications?page=1&page_size=999`)
}
