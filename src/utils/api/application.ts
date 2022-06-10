import { AllFieldName, FormData } from "@/components/Application/formData";
import http from "../axios";
import { getOrganizationByUrl } from "../utils";

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
    `/orgs/${getOrganizationByUrl()}/applications`,
    createApplicationRequest
  );
}
