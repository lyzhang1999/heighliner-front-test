import http from "@/utils/axios";
import {Page} from "./type";
import {find, get, uniq} from "lodash-es";
import {getOriIdByContext} from "@/utils/utils";
import {CreativeApiReturnField} from "../utils/commonType";

export interface OrgList {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  member: {
    id: number;
    created_at: number;
    updated_at: number;
    org_id: number;
    user_id: number;
    member_type: MemberType;
    status: number;
  };
  type: string;
}

interface Org {
  data: OrgList[];
  pagination: Page;
}

export const roleType = {
  Owner: "Owner",
  Admin: "Admin",
  Member: "Member",
};

export const RoleIcon = {
  [roleType.Owner]: '/img/teams/owner.webp',
  [roleType.Admin]: '/img/teams/admin.webp',
  [roleType.Member]: '/img/teams/member.webp'
}

export const getOrgList = (): Promise<Org> => {
  return new Promise((resolve, reject) => {
    http.get("/orgs?page=1&page_size=999").then(res => {
      let {data} = res;
      let defaultOrg = find(data, {type: "Default", member: {member_type: roleType.Owner}});
      data.unshift(defaultOrg);
      data = uniq(data);
      resolve({
        data: data,
        pagination: get(res, 'pagination')
      })
    }).catch(err => reject(err))
  })
};

export const createOrg = (name: string): Promise<any> => {
  return http.post("/orgs", {name});
};

interface LeaveOriReq {
  org_id: number;
}

export const leaveOriApi = ({org_id}: LeaveOriReq): Promise<any> => {
  return http.delete(`/orgs/${org_id}/members`);
};

interface DeleteOriReq {
  org_id: number;
}

export const deleteOri = ({org_id}: DeleteOriReq): Promise<any> => {
  return http.delete(`/orgs/${org_id}`);
};

export interface GetOrgMembersReq {
  org_id: number;
  page: number;
  page_size: number;
}


export interface Member extends CreativeApiReturnField {
  id: number;
  org_id: number;
  user_id: number;
  member_type: MemberType;
  nickname: string;
}

export type GetOrgMembersRes = {
  data: Array<Member>,
  pagination: Page;
};

export const getOrgMembers = ({org_id, page, page_size}: GetOrgMembersReq): Promise<GetOrgMembersRes> => {
  return http.get(
    `/orgs/${org_id}/members?page=${page}&page_size=${page_size}`
  );
};

interface TransferOriReq {
  org_id: number;
  new_owner_id: number;
}

export const transferOri = ({org_id, new_owner_id}: TransferOriReq): Promise<any> => {
  return http.post(`/orgs/${org_id}/transfer`, {new_owner_id});
};

export interface InviteeSuggestionsReq {
  org_id: number;
  username: string;
}

export type InviteeSuggestionsRes = Array<{
  is_member: boolean;
  user_id: number;
  username: string;
}>;

export const inviteeSuggestions = (
  req: InviteeSuggestionsReq
): Promise<InviteeSuggestionsRes> => {
  return http.get(
    `/orgs/${req.org_id}/invitations/invitee_suggestions?username=${req.username}`
  );
};

export interface InvitationsReq {
  org_id: number;
  body: {
    member_type: MemberType;
    user_id: number;
  };
}

export enum MemberTypeEnum {
  Owner = "Owner",
  Admin = "Admin",
  Member = "Member",
}

export type MemberType = keyof typeof MemberTypeEnum;

export const invitations = (req: InvitationsReq) => {
  return http.post(`/orgs/${req.org_id}/invitations`, req.body);
};

export interface DeleteMember {
  org_id: number;
  user_id: number;
}

export const deleteMember = (user_id: number) => {
  return http.delete(`/orgs/${getOriIdByContext()}/members/${user_id}`);
};

export interface ShiftRoleReq {
  user_id: number;
  body: {
    member_type: MemberType;
  };
}

export const shiftRole = (req: ShiftRoleReq) => {
  return http.put(`/orgs/${getOriIdByContext()}/members/${req.user_id}/role`, req.body);
};


export interface inviteReq {
  "email": string,
  "member_type": MemberType
}

export const inviteMember = (req: inviteReq) => {
  return http.post(`./orgs/${getOriIdByContext()}/invitations`, req)
}
