import http from '@/utils/axios';
import {string} from "prop-types";

interface List {
  id: number;
  created_at: number;
  updated_at: number;
  org_id: number;
  user_id: number;
  member_type: number;
  status: number;
}

export interface OrgList {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  member: List;
}

export const roleType = {
  "1": "Owner",
  "2": "Admin",
  "3": "Number",
}

export const getOrgList = (): Promise<OrgList[]> => {
  return http.get("orgs");
}

export const createOrg = (name: string): Promise<any> => {
  return http.post('/orgs', {name});
}

interface leaveOriReq {
  org_id: number,
}

export const leaveOriApi = ({org_id}: leaveOriReq): Promise<any> => {
  return http.delete(`/orgs/${org_id}/mumber`);
}

interface deleteOriReq{
  org_id: number
}

export const deleteOri = ({org_id}: deleteOriReq): Promise<any> => {
  return http.delete(`/orgs/${org_id}`);
}

