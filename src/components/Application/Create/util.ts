import {backItem} from "@/components/Application/Create/BackEnd";
import {find, get, map} from "lodash-es";
import {frontItem} from "@/components/Application/Create/FrontEnd";
import {FormStateType} from "@/pages/[organization]/applications/creation";
import {getRepoListRes} from "@/api/application";

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


export interface FrameworkType {
  isRepo: boolean;
  framework: string;
  repo_url: string;
  env: Array<{ name: string; value: string }>;
  exposePort: string;
  path: Array<{ v: string }>;
  rewrite: boolean;
  entryFile: string;
}

export const BackendFrameWorkInitState: FrameworkType = {
  isRepo: false,
  framework: "",
  repo_url: "",
  env: [],
  exposePort: "",
  path: [{v: "/api"}],
  rewrite: true,
  entryFile: "",
};

export const FrontendFrameWorkInitState: FrameworkType = {
  isRepo: false,
  framework: "",
  repo_url: "",
  env: [],
  exposePort: "",
  path: [{v: "/"}],
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

export const MiddleWaresInitState: MiddleWareType[] = [];

const initData = {
  ...componentInitState1,
  ...componentInitState2,
  service: [],
};

export default initData;

export interface FrameItemType {
  img: string,
  name: string,
  key: string,
  version: string,
  language: string
}

function getService(key: string, value: FrameworkType, frameList: FrameItemType[], repoList: getRepoListRes[], appName: string) {
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
  let thisItem = find(frameList, {key: framework});
  let name = '';
  let port = Number(exposePort);
  if (isRepo) {
    let thisRepo = find(repoList, {url: repo_url});
    name = get(thisRepo, 'repo_name', '');
  } else {
    entryFile = '';
    repo_url = '';
    if (key === 'backend') {
      port = 8000;
    } else if (key === 'frontend') {
      port = 80;
    }
    name = key + '-' + appName;
  }

  let obj = {
    framework: {
      name: framework,
      version: get(thisItem, 'version', ''),
    },
    language: {
      name: get(thisItem, 'language', ''),
      version: get(thisItem, 'version', ''),
    },
    name,
    scaffold: !isRepo,
    setting: {
      env: env,
      expose: [
        {
          paths: map(path, i => {
            return {path: i.v}
          }),
          port: port,
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

export function getParams(formState: FormStateType, repoList: getRepoListRes[]) {
  let {selectAStack, providers, backend, frontend, middleWares} = formState;
  let {Name, Stack} = selectAStack;
  let {[FieldsMap.gitProvider]: git_org_name, git_config: {git_provider_id}, cluster_id} = providers;
  const service = [
    getService('backend', backend, backItem, repoList, Name),
    getService('frontend', frontend, frontItem, repoList, Name)
  ]
  const body = {
    name: Name,
    stack: Stack,
    cluster_id,
    git_config: {
      git_org_name,
      git_provider_id: Number(git_provider_id),
    },
    service,
    middleware: middleWares.map(i => {
      let {
        name,
        type,
        injection,
      } = i;
      let nameArr = injection.map((item: string) => {
        if (item === 'backend') {
          return service[0].name;
        }
        if (item === 'frontend') {
          return service[1].name;
        }
      })
      return {
        service: nameArr,
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
  return body;
}
