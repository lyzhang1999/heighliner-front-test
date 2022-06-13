import http from "../axios";

export interface PasswordReq {
  ["check_new_password"]: string;
  ["new_password"]: string;
  ["old_password"]: string;
}

export function updatePassword(data: PasswordReq) {
  return http.patch(`/user/password`, data);
}

export interface BasicProfileReq {
  avatar: string;
  email?: string;
  username: string;
}

export interface BasicProfileRes {
  avatar: string;
  created_at: number;
  email: string;
  github_id: number;
  id: number;
  password: string;
  status: number;
  updated_at: number;
  username: string;
}

export function updateBasicProfile(
  data: BasicProfileReq
): Promise<BasicProfileRes> {
  return http.patch(`/user`, data);
}
