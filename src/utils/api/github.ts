import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";

export interface PutInstallationReq {
  org_id: number;
  installation_id: string;
}

/**
 *  After user installed GitHub app, GitHub will return an installation_id 
 *  which will be sent to backend service to do further authorization.
 */
export function putInstallation(req: PutInstallationReq) {
  return http.put(
    `/orgs/${req.org_id}/github/installation/${req.installation_id}`
  );
}
