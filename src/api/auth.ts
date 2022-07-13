import { AxiosRequestConfig } from "axios";
import http from "../utils/axios";

export enum LoginType {
  Email = "email",
  GitHub = "github",
}

export type GetAuthTokenReq =
  | {
      login_type: LoginType.Email;
      body: {
        email: string;
        password: string;
      };
    }
  | {
      login_type: LoginType.GitHub;
      code: string;
    };
export interface GetAuthTokenRes {
  expire_in: number;
  token: string;
}

export function getAuthToken(req: GetAuthTokenReq): Promise<GetAuthTokenRes> {
  let body = undefined;
  let config: AxiosRequestConfig = {
    params: {
      login_type: req.login_type,
    },
    // Transform expire_in time from second to millisecond
    transformResponse: [
      function (data) {
        const json = JSON.parse(data);
        if (json.expire_in && json.expire_in > 0) {
          json.expire_in = json.expire_in * 1000;
        }
        return json;
      },
    ],
  };

  switch (req.login_type) {
    case LoginType.Email:
      body = req.body;
      break;
    case LoginType.GitHub:
      config.params.code = req.code;
      break;
  }

  return http.post(`/auth/token`, body, config);
}
