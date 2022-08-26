import http from "@/utils/axios";
import { getOriIdByContext } from "@/utils/utils";

export type EnvVariables = Array<{
  name: string;
  value: string;
}>;

export interface Service {
  env: EnvVariables;
  expose: Array<{
    path: string;
    rewrite: boolean;
  }>;
  name: string;
  repo: {
    html_url: string;
    name: string;
    visibility: "public" | "private";
  };
}

export interface GetAppSettingsRes {
  service: Array<Service>;
}

export function getAppSettings({
  app_id,
}: {
  app_id: number;
}): Promise<GetAppSettingsRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/setting`
  );
}
