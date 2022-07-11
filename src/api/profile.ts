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
  username: string;
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


export interface UserInfo {
  id: number;
  created_at: number;
  created_by: number;
  updated_at: number;
  updated_by: number;
  nickname: string;
  password: string;
  email: string;
  avatar: string;
  status: number;
  github_id: number;
}

export function getUserInfo(): Promise<UserInfo>{
  return http.get('/user');
}
