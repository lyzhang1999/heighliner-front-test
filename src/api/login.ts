import http from '@/utils/axios';

export enum LoginType {
  GITHUB = "github",
  ACCOUNT = "account",
}

interface Req {
  logintype: LoginType,
  code?: string,
  user?: string,
  pass?: string,
}

export interface Res {
  token: string
}

export const login = (params: Req): Promise<Res> => {
  let {user, pass, logintype, code} = params;
  let url = '';
  if (code) {
    url = `/auth/token?login_type=${logintype}&code=${code}`
  } else {
    url = `/auth/token?login_type=${logintype}`
  }
  return http.post(url, {username: user, password: pass})
}

export interface SignUpReq {
  check_password: string,
  password: string,
  nickname: string,
  email: string,
}

interface SignUpRes {

}

export const signUpApi = (params: SignUpReq): Promise<SignUpRes> => {
  return http.post("/register", params)
}
