import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";

export interface PutInstallationReq {
  org_id: number;
  installation_id: string;
}

export function putInstallation(req: PutInstallationReq) {
  return http.put(
    `/orgs/${req.org_id}/github/installation/${req.installation_id}`
  );
}
