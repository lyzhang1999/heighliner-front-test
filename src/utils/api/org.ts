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
  type: string
}

export const roleType = {
  "Owner": "Owner",
  "Admin": "Admin",
  "Number": "Number",
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

interface deleteOriReq {
  org_id: number
}

export const deleteOri = ({org_id}: deleteOriReq): Promise<any> => {
  return http.delete(`/orgs/${org_id}`);
}

interface OriMumberReq {
  org_id: number,
  page: number,
  page_size: number,
}

export interface getOriRes {
  id: number;
  created_at: number;
  updated_at: number;
  org_id: number;
  user_id: number;
  member_type: string;
  username: string;
}

export const getOriMumbers = ({org_id, page, page_size}: OriMumberReq): Promise<getOriRes[]> => {
  return http.get(`/orgs/${org_id}/members?page=${page}&page_size=${page_size}`);
}

interface transferOriReq {
  org_id: number,
  new_owner_id: number,
}

export const transferOri = ({org_id, new_owner_id}: transferOriReq): Promise<any> => {
  return http.post(`/orgs/${org_id}/transfer`, {new_owner_id})
}

