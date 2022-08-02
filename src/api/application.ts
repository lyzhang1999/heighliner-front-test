import { string } from "yup/lib/locale";
import http from "../utils/axios";
import { CreativeApiReturnField } from "../utils/commonType";
import { getOriIdByContext } from "../utils/utils";

export interface CreateApplicationRequest {
  cluster_id: number;
  git_config: {
    git_org_name: string;
    git_provider_id: number;
  };
  name: string;
  networking?: {
    domain: string;
  };
  stack_id: number;
}

export interface CreateApplicationResponse {
  app_id: number;
  release_id: number;
}

export function createApplication(
  createApplicationRequest: CreateApplicationRequest
): Promise<CreateApplicationResponse> {
  return http.post(
    `/orgs/${getOriIdByContext()}/applications`,
    createApplicationRequest
  );
}

export interface GetApplicationReq {
  app_id: string;
  release_id: string;
}

export enum ApplicationStatus {
  COMPLETED = "Completed",
  PROCESSING = "Processing",
  FAILED = "Failed",
}

export const StatusColor = {
  Completed: "#60e3ac",
  Processing: "yellow",
  Failed: "red",
};

export interface GetApplicationStatusRes extends CreativeApiReturnField {
  id: number;
  application_id: number;
  name: string;
  namespace: string;
  cluster_id: number;
  job_namespace: string;
  start_time: number;
  completion_time: number;
  status: ApplicationStatus;
}

export function getApplicationStatus(
  req: GetApplicationReq
): Promise<GetApplicationStatusRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/releases/${
      req.release_id
    }`
  );
}

export interface Last_release extends CreativeApiReturnField {
  id: number;
  application_id: number;
  name: string;
  namespace: string;
  cluster_id: number;
  job_namespace: string;
  start_time: number;
  completion_time: number;
  status: ApplicationStatus;
}

export interface Stack {
  id: number;
  created_at: number;
  updated_at: number;
  name: string;
  url: string;
  version: string;
}

export interface ApplicationObject {
  app_id: number;
  app_name: string;
  last_release: Last_release;
  stack: Stack;
  owner_id: number;
  owner_name: string;
}

export interface getAppListReq {
  cluster_ids?: number[];
  owner_ids?: number[];
  stack_ids?: number[];
}

export function getApplicationList(
  params: getAppListReq = {}
): Promise<ApplicationObject[]> {
  let { cluster_ids = [], owner_ids = [], stack_ids = [] } = params;
  let url = `/orgs/${getOriIdByContext()}/applications?`;
  cluster_ids.forEach((item) => {
    url += `cluster_ids=${item}&`;
  });
  owner_ids.forEach((item) => {
    url += `owner_ids=${item}&`;
  });
  stack_ids.forEach((item) => {
    url += `stack_ids=${item}&`;
  });
  return http.get(url);
}

export interface GetAppEnvironmentsReq {
  org_id: number;
  app_id: number;
}

export type WorkloadType =
  | "Deployment"
  | "StatefuleSet"
  | "DaemonSet"
  | "Job"
  | "CronJob"
  | "Pod";

export type ResourceType =
  | "All"
  | "Deployment"
  | "StatefulSet"
  | "DaemonSet"
  | "Job"
  | "CronJob";

export type GetAppEnvironmentsRes = Array<{
  cluster: {
    created_at: number;
    id: number;
    in_cluster: boolean;
    kubeconfig: string;
    name: string;
    org_id: number;
    provider: string;
    updated_at: number;
  };
  name: string;
  namespace: string;
  resources: Array<{
    name: string;
    namespace: string;
    ready_total: number;
    total: number;
    type: ResourceType;
  }>;
  space: {
    access: {
      previewURL: string;
    };
    chart: {
      defaultBranch: string;
      path: string;
      type: string;
      url: string;
      valuesFile: string;
      version: string;
    };
    name: string;
    namespace: string;
  };
  status: "Active";
}>;

export function getAppEnvironments(
  req: GetAppEnvironmentsReq
): Promise<GetAppEnvironmentsRes> {
  return http.get(
    `/orgs/${req.org_id}/applications/${req.app_id}/environments`
  );
}

export interface GetApplicationInfoReq {
  org_id?: number;
  app_id: number;
}

export interface GetApplicationInfoRes extends CreativeApiReturnField {
  cluster_id: number;
  domain: string;
  git_org_name: string;
  git_provider: string;
  git_token: string;
  id: number;
  name: string;
  org_id: number;
  stack_id: number;
}

export function getApplicationInfo(
  req: GetApplicationInfoReq
): Promise<GetApplicationInfoRes> {
  const org_id = req.org_id !== undefined ? req.org_id : getOriIdByContext();
  return http.get(`/orgs/${org_id}/applications/${req.app_id}`);
}

export type GetRepoListRes = Array<{
  git_organization: string;
  provider: string;
  repo_name: string;
  repo_type: string;
  repo_url: string;
}>;

export function getRepoList(appId: string): Promise<GetRepoListRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${appId}/repositorys`
  );
}

export function deleteApplication(appId: number): Promise<any> {
  return http.delete(`/orgs/${getOriIdByContext()}/applications/${appId}`);
}

export interface getRepoListReq {
  owner_name: string;
  owner_type: string;
  git_provider_id: number;
}

export interface getRepoListRes {
  language: string;
  provider: string;
  repo_name: string;
  url: string;
}

export function getTheRepoList({
  owner_name,
  owner_type,
  git_provider_id,
}: getRepoListReq): Promise<getRepoListRes[]> {
  return http.get(`/user/git_providers/${git_provider_id}/repo`, {
    params: {
      owner_type,
      owner_name,
    },
  });
}

export interface createAppRes {
  application_env_id: number;
  application_id: number;
  application_release_id: number;
}

export function createApp(body: any): Promise<createAppRes> {
  return http.post(`/orgs/${getOriIdByContext()}/applications`, body);
}

export interface Last_release extends CreativeApiReturnField {
  id: number;
  application_id: number;
  application_env_id: number;
  name: string;
  namespace: string;
  cluster_id: number;
  job_namespace: string;
  start_time: number;
  completion_time: number;
  status: ApplicationStatus;
}

export interface Deploy {
  name: string;
  url: string;
  visibility: string;
  path: string;
  values_file: string;
}

export interface Application {
  name: string;
  domain: string;
  namespace: string;
  deploy: Deploy;
  service: any[];
}

export interface Scm {
  name: string;
  type: string;
  organization: string;
}

export interface Image {
  name: string;
  registry: string;
  username: string;
  password: string;
}

export interface Setting {
  is_update: boolean;
  application: Application;
  scm: Scm;
  image: Image;
  middleware: any[];
}

export interface EnvItemRes {
  application_env_id: number;
  application_id: number;
  owner_id: number;
  owner_name: string;
  name: string;
  domain: string;
  env_type: string;
  namespace: string;
  last_release: Last_release;
  setting: Setting;
}

export function getEnvs(appId: string): Promise<EnvItemRes[]> {
  return http.get(`/orgs/${getOriIdByContext()}/applications/${appId}/envs`);
}

export interface GetEnvReq {
  app_id: number;
  env_id: number;
}

export type GetEnvRes = EnvItemRes;

export function getEnv({ app_id, env_id }: GetEnvReq): Promise<GetEnvRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/envs/${env_id}`
  );
}

export interface GetEnvResourcesReq {
  app_id: number;
  env_id: number;
  resource_type?: ResourceType;
}

export type GetEnvResourcesRes = Array<{
  container: Array<{
    image: string;
    name: string;
  }>;
  name: string;
  namespace: string;
  status: {
    ready_replicas: number;
    replicas: number;
  };
  type: ResourceType;
}>;

export function getEnvResources({
  app_id,
  env_id,
  resource_type,
}: GetEnvResourcesReq): Promise<GetEnvResourcesRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/envs/${env_id}/resources`,
    {
      params: {
        resource_type: resource_type || "All",
      },
    }
  );
}

export type GetEnvSettingReq = GetEnvReq;

interface Middleware {
  database: {
    name: string;
  }[];
  name: string;
  password: string;
  service: string[];
  setting: {
    storage: string;
  };
  type: string;
  url: string;
  username: string;
}

interface Service {
  framework: string;
  image: {
    repository: string;
    tag: string;
  };
  language: {
    name: string;
    version: string;
  };
  name: string;
  repo: {
    url: string;
    visibility: string;
  };
  scaffold: boolean;
  setting: {
    env: {
      name: string;
      value: string;
    }[];
    expose: Array<{
      paths: {
        path: string;
      }[];
      port: number;
      rewrite: boolean;
    }>;
    extension: {
      entry_file: string;
    };
    fork: {
      from: string;
      type: string;
    };
  };
  type: ServiceType;
}

export interface GetEnvSettingRes {
  application: {
    deploy: Deploy;
    domain: string;
    name: string;
    namespace: string;
    service: Service[];
  };
  fork_env: {
    cluster: string;
    name: string;
  };
  image: Image;
  is_update: true;
  middleware: Middleware[];
  scm: Scm;
}

export function getEnvSetting({
  app_id,
  env_id,
}: GetEnvSettingReq): Promise<GetEnvSettingRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/envs/${env_id}/setting`
  );
}

export interface AppRepoRes {
  git_organization: string;
  provider: string;
  repo_name: string;
  repo_url: string;
}

export function getApplicationRepos(appid: string): Promise<AppRepoRes[]> {
  return http.get(`/orgs/${getOriIdByContext()}/applications/${appid}/repos`);
}

export enum ServiceType {
  backend = "backend",
  frontend = "frontend",
}

export enum ForkType {
  branch = "branch",
}

export enum EnvType {
  Test = "Test",
  Development = "Development",
}

export enum EnvVariableMap {
  name = "name",
  value = "value",
}

export type EnvVariables = Array<{
  [EnvVariableMap.name]: string;
  [EnvVariableMap.value]: string;
}>;

export interface ForkReq {
  app_id: number;
  body: {
    env_name: string;
    env_type: EnvType;

    service: Array<{
      name: string;
      repo_url: string;
      setting: {
        env: EnvVariables;
        fork: {
          from: string;
          type: ForkType;
        };
      };
      type: ServiceType;
    }>;
  };
}

export interface ForkRes extends createAppRes {}

export function fork(req: ForkReq): Promise<ForkRes> {
  return http.post(
    `/orgs/${getOriIdByContext()}/applications/${req.app_id}/fork`,
    req.body
  );
}

export interface GetProdEnvRes extends CreativeApiReturnField {
  application_id: number;
  domain: string;
  env_type: EnvType;
  git_org_name: string;
  git_provider_id: number;
  id: number;
  name: string;
  namespace: string;
  owner_id: number;
  setting_content: string;
}

export function getProdEnv(app_id: string): Promise<GetProdEnvRes> {
  return http.get(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/envs/prod`
  );
}

export function deleteEnv({
  app_id,
  env_id,
}: {
  app_id: number | string;
  env_id: number | string;
}) {
  return http.delete(
    `/orgs/${getOriIdByContext()}/applications/${app_id}/envs/${env_id}`
  );
}
