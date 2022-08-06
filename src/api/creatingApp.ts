import http from "@/utils/axios";
import {getOriIdByContext} from "@/utils/utils";

interface GetAppTimeLineReq {
  app_id: string,
  release_id: string
}


export interface GetAppTimeLineRes {
  id: number;
  created_at: number;
  created_by: number;
  updated_at: number;
  updated_by: number;
  release_id: number;
  status: string;
  description: string;
  type: string;
  detail: string;
  step: number
}


export function getAppTimeLine(req: GetAppTimeLineReq): Promise<GetAppTimeLineRes[]> {
  let {app_id, release_id} = req;
  return http.get(`/orgs/${getOriIdByContext()}/applications/${app_id}/releases/${release_id}/events`)
}
