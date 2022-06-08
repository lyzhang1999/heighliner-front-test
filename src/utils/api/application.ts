import { AllFieldName, FormData } from "@/components/Application/formData";
import http from "../axios";
import { getOriginzationByUrl } from "../utils";

export interface CreateApplicationRequest {
  cluster_id: number;
  git_config: {
    org_name: string
    provider: string;
    token: string;
  };
  name: string;
  networking: {
    domain: string;
  };
  stack_id: number;
}

export function createApplication(
  createApplicationRequest: CreateApplicationRequest
) {
  return http.post(
    `/orgs/${getOriginzationByUrl()}/applications`,
    createApplicationRequest
  );
}
