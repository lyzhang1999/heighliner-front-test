import { AllFieldName, FormData } from "@/components/Application/formData";
import http from "../axios";
import { getOriginzationByUrl } from "../utils";

interface CreateApplicationRequest {
  cluster_id: number;
  git_config: {
    provider: string;
    token: string;
  };
  name: string;
  networking: {
    domain: string;
  };
  stack_id: number;
}

export function createApplication(formData: FormData) {
  const createApplicationRequest: CreateApplicationRequest = {
    cluster_id: formData[AllFieldName.Cluster],
    git_config: {
      provider: "GITHUB",
      token: formData[AllFieldName.GitHubToken],
    },
    name: formData[AllFieldName.ApplicationName],
    networking: {
      domain: formData[AllFieldName.Domain],
    },
    stack_id: formData[AllFieldName.StackCode],
  };

  return http.post(
    `/orgs/${getOriginzationByUrl()}/clusters`,
    createApplicationRequest
  );
}
