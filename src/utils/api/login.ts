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
    url = `/auth/token?login_type=${logintype}&username=${user}&password=${pass}`
  }
  return http.get(url)
}

interface SignUpReq {
  check_password: string,
  password: string,
  username: string
}

interface SignUpRes {

}

export const signUpApi = (params: SignUpReq): Promise<SignUpRes> => {
  return http.post("/register", params)
}
