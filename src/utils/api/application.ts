import {AllFieldName, FormData} from "@/components/Application/formData";
import http from "../axios";
import { getOriIdByContext } from "../utils";

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
