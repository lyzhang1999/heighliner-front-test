import backEnd, {backItem} from "@/components/Application/Create/BackEnd";
import {find, map} from "lodash-es";
import {frontItem} from "@/components/Application/Create/FrontEnd";

export interface Git_config {
  git_org_name: string;
  git_provider_id: number;
}

export interface Setting {
  storage: string;
}

export interface Middleware {
  service: string[];
  name: string;
  password: string;
  setting: Setting;
  type: string;
  username: string;
}

export interface Framework {
  name: string;
  version: string;
}

export interface Language {
  name: string;
  version: string;
}

export interface Env {
  name: string;
  value: string;
}

export interface Path {
  path: string;
}

export interface Expose {
  paths: Path[];
  port: number;
  rewrite: boolean;
}

export interface Extended_field {
  entry_file: string;
}

export interface Setting {
  env: Env[];
  expose: Expose[];
  extended_fields: Extended_field;
  repo_url: string;
}

export interface Service {
  framework: Framework;
  language: Language;
  name: string;
  scaffold: boolean;
  setting: Setting;
  type: string;
}

export interface RootObject {
  cluster_id: number;
  git_config: Git_config;
  middleware: Middleware[];
  name: string;
  service: Service[];
}

const testdate = {
  cluster_id: 4,
  git_config: {
    git_org_name: "ni9ht-org",
    git_provider_id: 1,
  },
  middleware: [
    {
      Service: ["test-stack-ysz-11-backend"],
      name: "pg",
      password: "admin",
      setting: {
        storage: "10Gi",
      },
      type: "postgres",
      username: "admin",
    },
  ],
  name: "test-stack-ysz-11",
  service: [
    {
      framework: {
        name: "gin",
        version: "1.7.7",
      },
      language: {
        name: "golang",
        version: "1.17",
      },
      name: "",
      scaffold: true,
      setting: {
        env: [
          {
            name: "TEST_ENV_KEY",
            value: "vadf123",
          },
        ],
        expose: [
          {
            paths: [{path: "/api"}],
            port: 8000,
            rewrite: true,
          },
        ],
        extended_fields: {
          entry_file: "",
        },
        repo_url: "",
      },
      type: "backend",
    },
    {
      framework: {
        name: "nextjs",
        version: "1.7.7",
      },
      language: {
        name: "typescript",
        version: "1.8",
      },
      name: "",
      scaffold: true,
      setting: {
        env: [
          {
            name: "TEST_FRONTEND_ENV",
            value: "aadf34",
          },
        ],
        expose: [
          {
            paths: [{path: "/"}],
            port: 80,
            rewrite: false,
          },
        ],
        extended_fields: {
          entry_file: "",
        },
        repo_url: "",
      },
      type: "frontend",
    },
  ],
};

const componentInitState1 = {
  name: "",
  stack: "web-application",
};

const componentInitState2 = {
  cluster_id: "",
  git_config: {
    git_org_name: "",
    git_provider_id: "",
  },
};

export const FieldsMap = {
  stack: "Stack",
  name: "Name",
  gitProvider: "Git Provider",
  clusterProvider: "Cluster Provider",
} as const;

export interface SelectAStackType {
  [FieldsMap.name]: string;
  [FieldsMap.stack]: string;

}

export const SelectAStackInitState: SelectAStackType = {
  [FieldsMap.name]: "",
  [FieldsMap.stack]: "",
};

export interface ProvidersType {
  [FieldsMap.clusterProvider]: string,
  [FieldsMap.gitProvider]: string,
  cluster_id: string;
  git_config: {
    owner_name: string;
    owner_type: string;
    git_org_name: string;
    git_provider_id: string;
  };
};

export const ProvidersInitState = {
  [FieldsMap.clusterProvider]: "",
  [FieldsMap.gitProvider]: "",
  cluster_id: "",
  git_config: {
    owner_name: "",
    owner_type: "",
    git_org_name: "",
    git_provider_id: "",
  },
};


export interface BackendType {
  isRepo: boolean;
  framework: string;
  repo_url: string;
  env: Array<{ name: string; value: string }>;
  exposePort: string;
  path: Array<{ v: string }>;
  rewrite: false;
  entryFile: string;
}

export const FrameWorkInitState: BackendType = {
  isRepo: false,
  framework: "",
  repo_url: "",
  env: [],
  exposePort: "",
  path: [{v: ""}],
  rewrite: false,
  entryFile: "",
};

export interface MiddleWareType {
  name: string;
  type: string;
  injection: Array<any>;
}

export const InitMiddleWareItem = {
  name: "",
  type: "",
  injection: [],
};

export const MiddleWaresInitState: MiddleWareType[] = [InitMiddleWareItem];

const initData = {
  ...componentInitState1,
  ...componentInitState2,
  service: [],
};

export default initData;


function getService(key, value, item) {
  let {
    isRepo,
    framework,
    repo_url,
    env,
    exposePort,
    path,
    rewrite,
    entryFile,
  } = value;
  let thisItem = find(item, {key: framework})

  let obj = {
    framework: {
      name: framework,
      version: thisItem.version,
    },
    language: {
      name: thisItem.language,
      version: thisItem.version,
    },
    name: "",
    scaffold: isRepo,
    setting: {
      env: env,
      expose: [
        {
          paths: map(path, i => {
            return {path: i.v}
          }),
          port: exposePort,
          rewrite: rewrite,
        },
      ],
      extended_fields: {
        entry_file: entryFile,
      },
      repo_url: repo_url,
    },
    type: key,
  }
  return obj;
}


export function getParams(formState) {
  let {selectAStack, providers, backend, frontend, middleWares} = formState;
  let {Name, Stack} = selectAStack;
  let {[FieldsMap.gitProvider]: git_org_name, git_config: {git_provider_id}} = providers;
  const body = {
    name: Name,
    stack: Stack,
    git_config: {
      git_org_name,
      git_provider_id,
    },
    service: [
      getService('backend', backend, backItem),
      getService('frontedn', frontend, frontItem)],
    middleware: map(middleWares, i => {
      let {
        name,
        type,
        injection,
      } = i;
      return {
        Service: injection,
        name: name,
        password: "admin",
        setting: {
          storage: "10Gi",
        },
        type: type,
        username: "admin",
      }
    })
  }
  console.warn(body)
  return body;
}
