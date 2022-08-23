import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";
import { ResourceType } from "../application";

export interface GetEnvResourcesReq {
  app_id: number;
  env_id: number;
  resource_type?: ResourceType;
}

export enum PodStatus {
  PENDING = 'Pending',
  RUNNING = 'Running',
  SUCCEEDED = 'Succeeded',
  FAILED = 'Failed',
  UNKNOWN = 'Unknown'
}

export type GetEnvResourcesRes = Array<{
  name: string;
  namespace: string;
  pods: Array<{
    container: Array<{
      image: string;
      name: string;
    }>;
    name: string;
    status: PodStatus;
  }>;
  status: {
    ready_replicas: number;
    replicas: number;
  };
  type: ResourceType;
}>;

export function getEnvResources({
  app_id,
  env_id,
  resource_type,
}: GetEnvResourcesReq): Promise<GetEnvResourcesRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/envs/${env_id}/resources`,
    {
      params: {
        resource_type: resource_type || "All",
      },
    }
  );
}
