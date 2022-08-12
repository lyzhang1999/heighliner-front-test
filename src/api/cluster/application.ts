import http from "@/utils/axios";
import { CreativeApiReturnField } from "@/utils/commonType";

export enum ClusterApplicationStatus {
  COMPLETE = "Complete",
  PROCESSING = "Processing",
  REJECTED = "Rejected",
}

export interface CreateClusterApplicationRes extends CreativeApiReturnField {
  id: number;
  org_id: number;
  org_name: string;
  reason: string;
  remark: string;
  status: ClusterApplicationStatus;
  user_id: number;
}

export function createClusterApplication(
  org_id: number
): Promise<CreateClusterApplicationRes> {
  return http.post(`/cluster_applys`, {
    org_id,
  });
}

export type GetClusterApplicationRes = Array<
  CreateClusterApplicationRes & {
    user_nickname: string;
  }
>;

export function getClusterApplication(
  org_id: number
): Promise<GetClusterApplicationRes> {
  return http.get(`/cluster_applys/orgs/${org_id}`);
}
