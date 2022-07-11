import http from "../utils/axios";

export enum LoginType {
  Email = "email",
}

export interface GetAuthTokenReq {
  login_type: LoginType;
  body: {
    email: string;
    password: string;
  };
}

export interface GetAuthTokenRes {
  expire_in: number;
  token: string;
}

export function getAuthToken(req: GetAuthTokenReq): Promise<GetAuthTokenRes> {
  return http.post(`/auth/token`, req.body, {
    params: {
      login_type: req.login_type,
    },
    transformResponse: [
      function (data) {
        // Transform expire_in time from second to millisecond
        const json = JSON.parse(data);
        if (json.expire_in && json.expire_in > 0) {
          json.expire_in = json.expire_in * 1000;
        }
        return json;
      },
    ],
  });
}
