import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";
import { Service, GetAppSettingsRes } from "./settings";

export interface GetEnvSettingReq {
  app_id: number;
  env_id: number;
}

export type GetEnvSettingRes = {
  application_env_id: number;
  application_id: number;
} & Pick<GetAppSettingsRes, "service">;

export function getEnvSetting({
  app_id,
  env_id,
}: GetEnvSettingReq): Promise<GetEnvSettingRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/envs/${env_id}/setting`
  );
}

export interface UpdateEnvSettingReq {
  app_id: number;
  env_id: number;
  body: {
    service: Array<Pick<Service, "name" | "env">>;
  };
}

/**
 * @Deprecated Use src/api/application/env-settings.ts instead.
 */
export function updateEnvSetting(req: UpdateEnvSettingReq) {
  return http.patch(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/envs/${
      req.env_id
    }/setting`,
    req.body
  );
}
