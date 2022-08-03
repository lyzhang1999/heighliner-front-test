import { CreativeApiReturnField } from "@/utils/commonType";
import http from "../utils/axios";

export interface PasswordReq {
  ["check_new_password"]: string;
  ["new_password"]: string;
  ["old_password"]: string;
}

export function updatePassword(data: PasswordReq) {
  return http.patch(`/user/password`, data);
}

interface _BasicProfileReq {
  avatar: string;
  email: string;
  nickname: string;
}

export type BasicProfileReq = Partial<_BasicProfileReq>;

export interface BasicProfileRes {
  avatar: string;
  created_at: number;
  email: string;
  github_id: number;
  id: number;
  password: string;
  status: number;
  updated_at: number;
  nickname: string;
}

export function updateBasicProfile(
  data: BasicProfileReq
): Promise<BasicProfileRes> {
  return http.patch(`/user`, data);
}

export interface UserInfo extends CreativeApiReturnField{
  id: number;
  nickname: string;
  password: string;
  email: string;
  avatar: string;
  status: number;
  github_id: number;
  preferred_org_id: number;
}

export function getUserInfo(): Promise<UserInfo> {
  return http.get("/user");
}

export interface ChangePreferredOrgRes extends CreativeApiReturnField {
  avatar: string;
  email: string;
  github_id: number;
  id: number;
  nickname: string;
  password: string;
  preferred_org_id: number;
  status: string;
  username: string;
}

export function changePreferredOrg(org_id: number): Promise<ChangePreferredOrgRes> {
  return http.post(`/user/change-preferred-org`, undefined, {
    params: {
      org_id,
    },
  });
}
