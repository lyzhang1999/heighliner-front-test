import {backItem} from "@/components/Application/Create/BackEnd";
import {filter, find, get, isEmpty, map, trim} from "lodash-es";
import {frontItem} from "@/components/Application/Create/FrontEnd";
import {FormStateType} from "@/pages/[organization]/applications/creation";
import {getRepoListRes} from "@/api/application";
import {PgTypes} from "@/components/Application/Create/Middlewares/MiddleDrawer";

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
  [FieldsMap.stack]: "micro",
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

export interface EnvType {
  name: string,
  value: string
}

//   static input-------------------
//   buildCommand: "",
//   outputDir: "",
//   devCommand: "",
//   staticType: 'spa', // spa or mpa
//   path404: "/404.html",
//   node input---------------------
//   buildCommand: "",
//   outputDir: "",
//   devCommand: "",
//   staticType: 'spa', // spa or mpa
//   deployCommand: "",
//   path404: "/404.html",
//   port: "",
//   env: [],
//   go input-----------------------
//   entryFile: "",
//   port: "",
//   env: [],

// @ts-ignore
export const MicroServiceInitData = {

  serviceName: "",
  isRepo: false,
  repoUrl: '',
  repoName: "",
  framework: '',
  baseImage: '',
  buildCommand: "",
  devCommand: "",
  runCommand: "",
  port: "",
  debugCommand: "",
  outputDir: "",
  env: [],
  staticType: 'spa', // spa or mpa
};

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

export interface FrameworkType {
  isRepo: boolean;
  framework: string;
  repo_url: string;
  env: Array<EnvType>;
  exposePort: string;
  path: Array<{ v: string }>;
  rewrite: boolean;
  entryFile: string;
}

export interface FrontendType {
  isRepo: boolean;
  framework: string;
  repo_url: string;
  env: Array<EnvType>;
  exposePort: string;
  path: Array<{ v: string }>;
  rewrite: boolean;
  entryFile: string;

  buildCommand: string,
  outputDir: string,
  buildEnv: Array<EnvType>,
  runCommand: string
  port: string,
  deployEnv: Array<EnvType>,
  staticDeployMode: "spa" | 'mpa' | '',
  path404: string,
  deployMode: 'static' | "command" | "",
  name: string
}

export const FrontendFrameWorkInitState: FrontendType = {
  isRepo: false,
  framework: "",
  repo_url: "",
  env: [],
  exposePort: "",
  path: [{v: "/"}],
  rewrite: false,
  entryFile: "",

  buildCommand: 'yarn install && yarn build',
  outputDir: '',
  buildEnv: [],
  deployMode: 'static',
  runCommand: "",
  port: '',
  deployEnv: [],
  staticDeployMode: 'spa',
  path404: '',
  name: ''
};

export const NetworkInitData = {
  path: '/',
  rewrite: true,
  isExport: true,
  service: "",
  port: '3000'
}

export interface MiddleWareType {
  name: string;
  type: string;
  injection: Array<any>;
  otherValue: PgTypes
}

export const InitMiddleWareItem = {
  name: "",
  type: "",
  injection: [],
  otherValue: {
    names: [{v: ''}],
    username: 'admin',
    password: "password",
    storage: '20'
  },
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
  language: string,
  languageVersion: string,
  port: string,
  entryFile: string,
  appType: string
}


export interface FrontendItemType {
  img: string,
  key: string,
  version: string,
  language: string,
  languageVersion: string,


  buildCommand: string,
  outputDir: string,
  buildEnv: Array<EnvType>,
  runCommand: string
  port: string,
  deployEnv: Array<EnvType>,
  staticDeployMode: "spa" | 'mpa' | '',
  path404: string,
  deployMode: 'static' | "command",
  name: string,
}

function getService(key: string, value: FrameworkType, frameList: FrameItemType[], repoList: getRepoListRes[], appName: string, middleWares: MiddleWareType[]) {
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
      port = 3000;
    }
    name = appName + '-' + key;
  }

  if (!isEmpty(middleWares)) {
    let injection = get(middleWares, '0.injection', []);
    let {names, username, password} = get(middleWares, '0.otherValue', {});
    if (injection.includes(key)) {
      env = [...env, ...
        [
          // {name: 'DatabaseHost', value: 'postgresql'},
          // {name: 'DatabaseUser', value: username},
          // {name: 'DatabasePassword', value: password},
          // {name: 'DatabaseName', value: get(names, '0.v', '')},
        ]
      ]
    }
  }

  let obj = {
    framework: {
      name: framework,
      version: get(thisItem, 'version', ''),
    },
    language: {
      name: get(thisItem, 'language', ''),
      version: get(thisItem, 'languageVersion', ''),
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

function getForntendService(key: string, value: FrontendType, frameList: FrameItemType[], repoList: getRepoListRes[], appName: string) {
  let {
    isRepo,
    framework,
    repo_url,
    buildCommand,
    outputDir,
    runCommand,
    port,
    deployEnv,
    staticDeployMode,
    path404,
    deployMode,
    name
  } = value;

  let frontendPort = Number(port);

  if (isRepo) {   // deploy frontend by repo
    let thisRepo = find(repoList, {url: repo_url});
    let name = get(thisRepo, 'repo_name', '');
    let obj = {
      framework: {
        name: "js",
        version: "1.7.7",
      },
      language: {
        name: "typescript",
        version: "1.7.7",
      },
      name: name,
      scaffold: false,
      setting: {
        env: deployEnv,
        expose: [
          {
            paths: [{path: "/"}],
            port: (deployMode === 'static') ? 3000 : frontendPort,
            rewrite: false,
          },
        ],
        extended_fields: {
          "frontend_404_path": (staticDeployMode === 'spa') ? '/404.html' : path404,
          "frontend_app_type": (staticDeployMode === 'spa') ? "SPA" : "MPA",
          "frontend_build_cmd": buildCommand,
          "frontend_out_dir": outputDir,
          "frontend_run_cmd": runCommand
        },
        repo_url: '',
      },
      type: (deployMode === 'static') ? 'frontend-static' : "frontend-cmd",
    }
    return obj;
  } else { // deploy frontend by framework
    let thisItem = find(frameList, {key: framework});
    let buildCommand = get(thisItem, 'buildCommand', '');
    let outputDir = get(thisItem, 'outputDir', '');
    let runCommand = get(thisItem, 'runCommand', '');
    let staticDeployMode = get(thisItem, 'staticDeployMode', '');
    let path404 = get(thisItem, 'path404', '');
    let deployMode = get(thisItem, 'deployMode', '');
    let key = get(thisItem, 'key', '');

    let obj = {
      framework: {
        name: key,
        version: get(thisItem, 'version', ''),
      },
      language: {
        name: get(thisItem, 'language', ''),
        version: get(thisItem, 'languageVersion', ''),
      },
      name: trim(name),
      scaffold: true,
      setting: {
        env: [],
        expose: [
          {
            paths: [{path: "/"}],
            port: 3000,
            rewrite: false,
          },
        ],
        extended_fields: {
          "frontend_404_path": (staticDeployMode === 'spa') ? '/404.html' : path404,
          "frontend_app_type": (staticDeployMode === 'spa') ? "SPA" : "MPA",
          "frontend_build_cmd": buildCommand,
          "frontend_out_dir": outputDir,
          "frontend_run_cmd": runCommand
        },
        repo_url: repo_url,
      },
      type: (deployMode === 'static') ? 'frontend-static' : "frontend-cmd",
    }
    return obj;
  }
}

export function getParams(formState: FormStateType, repoList: getRepoListRes[]) {
  let {selectAStack, providers, backend, frontend, middleWares} = formState;
  let {Name, Stack} = selectAStack;
  let {[FieldsMap.gitProvider]: git_org_name, git_config: {git_provider_id}, cluster_id} = providers;
  const service = [
    getService('backend', backend, backItem, repoList, Name, middleWares),
    getForntendService('frontend', frontend, frontItem, repoList, Name)
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
      let {names, username, password, storage} = i.otherValue;
      return {
        service: nameArr,
        name: name,
        database: names.map(i => {
          return {name: i.v}
        }),
        password: password,
        setting: {
          storage: storage + 'Gi',
        },
        type: type,
        url: 'postgresql',
        username: username,
      }
    })
  }
  return body;
}


export function getMicroParams(formState: FormStateType, repoList: getRepoListRes[]) {
  let {selectAStack, providers, middleWares, microService, networkData} = formState;
  let {Name, Stack} = selectAStack;
  let {[FieldsMap.gitProvider]: git_org_name, git_config: {git_provider_id}, cluster_id} = providers;

  let middle = {};
  if (!isEmpty(middleWares)) {
    let {
      name,
      injection,
      otherValue
    } = get(middleWares, '0', {});
    let {names, username, password, storage} = otherValue;
    middle = {
      postgres: {
        service: injection.map(item => {
          return {
            database_env: [
              {
                name: "DB_NAME",
                value: get(names, '0.v', ''),
              },
            ],
            name: item,
            password_key: "DatabasePassword",
            username_key: "DatabaseUser",
            host_key: "DatabaseHost",
            // name_key: "DatabaseName"
          }
        }),
        name: name,
        enabled: true,
        setting: {
          storage: storage + 'Gi',
          database: names.map(i => {
            return {name: i.v}
          }),
          password: password,
          username: username,
        },
      }
    }
  }

  const body = {
    name: Name,
    type: Stack,
    cluster_id,
    git_config: {
      git_org_name,
      git_provider_id: Number(git_provider_id),
    },
    service: microService.map(item => getServiceItem(item, middleWares, networkData, repoList)),
    middleware: middle,
  }
  return body;
}

function getServiceItem(item, middleWares, networkData, repoList) {
  let {
    serviceName, isRepo, repoUrl, framework, baseImage, buildCommand, devCommand, runCommand,
    port, debugCommand, outputDir, env, staticType, repoName
  } = item;

  let expose_path = filter(networkData, (item) => item.service === serviceName);

  expose_path = expose_path.map(item => {
    let {path, rewrite} = item;
    if (path === '/') {
      rewrite = false;
    }
    return {
      path,
      rewrite,
    }
  })

  if (isRepo) {
    let thisRepo = find(repoList, {url: repoUrl});

    return {
      framework,
      name: serviceName,
      scaffold: false,
      repo: {
        name: get(thisRepo, 'repo_name', ""),
        visibility: 'private'
      },
      setting: {
        base_image: baseImage,
        build_command: buildCommand,
        run_command: runCommand,
        port: Number(port),
        dev_command: devCommand,
        debug_command: debugCommand,
        output_dir: outputDir,
        static_type: staticType,
        path404: "404.html"
      },
      env,
      expose_path
    }
  } else {
    let thisItem = find(FrameWorksList, {key: framework});
    let buildCommand = get(thisItem, 'buildCommand', '');
    let outputDir = get(thisItem, 'outputDir', '');
    let runCommand = get(thisItem, 'runCommand', '');
    let baseImage = get(thisItem, 'baseImage', '');
    let devCommand = get(thisItem, 'devCommand', '');
    let debugCommand = get(thisItem, 'debugCommand', '');
    let port = get(thisItem, 'port', '');
    let staticType = get(thisItem, 'staticType', '');
    let env = get(thisItem, 'env', []);

    return {
      framework,
      name: serviceName,
      scaffold: true,
      repo: {
        name: repoName,
        visibility: 'private'
      },
      setting: {
        base_image: baseImage,
        build_command: buildCommand,
        run_command: runCommand,
        port: Number(port),
        dev_command: devCommand,
        debug_command: debugCommand,
        output_dir: outputDir,
        static_type: staticType,
        path404: "404.html"
      },
      env,
      expose_path
    }
  }
}


export const FrameWorksList = [
  {
    img: "/img/application/next.svg",
    name: 'Next.js',
    key: "nextjs",

    baseImage: "node:16",
    buildCommand: 'yarn install && yarn build',
    devCommand: "yarn install && yarn dev",
    runCommand: 'yarn start',
    debugCommand: 'yarn install && yarn dev',
    outputDir: '',
    port: '3000',
    staticType: '',
  },
  {
    img: "/img/application/create/vite.svg",
    name: 'Vite',
    key: "vite",
    baseImage: "node:16",
    buildCommand: 'yarn install && yarn build',
    devCommand: "yarn install && yarn dev",
    runCommand: "",
    debugCommand: "",
    port: "3000",
    outputDir: 'dist',
    staticType: "spa",
  },
  {
    img: "/img/application/vue.svg",
    name: 'Vue-Cli',
    key: "vue",

    baseImage: "node:16",
    buildCommand: 'yarn install && yarn build',
    devCommand: "yarn install && yarn dev",
    runCommand: "",
    debugCommand: "",
    port: "3000",
    outputDir: 'dist',
    staticType: "spa",
  },
  {
    img: "/img/application/create/create-react-app.svg",
    name: 'React-App',
    key: "react",

    baseImage: "node:16",
    buildCommand: 'yarn install --frozen-lockfile && yarn build',
    devCommand: "yarn install && yarn dev",
    runCommand: "",
    debugCommand: "yarn install && yarn dev",
    port: "3000",
    outputDir: 'build',
    staticType: "spa",
  },

  {
    img: "/img/application/gin.svg",
    name: 'Gin',
    key: "gin",
    baseImage: "golang:1.19",
    buildCommand: 'go build -o build/app main.go',
    devCommand: "go run main.go",
    runCommand: "./app",
    debugCommand: "go run main.go",
    port: "8000",
    outputDir: 'build',
    staticType: "",
  },
  {
    img: "/img/application/create/spring.png",
    name: 'Spring',
    key: "spring",
    baseImage: "openjdk:18",
    buildCommand: './gradlew build && cp "build/libs/*.jar build/libs/app.jar',
    devCommand: "./gradlew -jar bootrun",
    runCommand: "java -jar app.jar",
    debugCommand: "./gradlew -jar bootrun --debug-jvm",
    port: "8080",
    outputDir: 'build/libs',
    staticType: "",
  },
  {
    img: "/img/application/create/flask.png",
    name: 'Flask',
    key: "flask",
    baseImage: "python:3.10",
    buildCommand: 'pip3 install -r requirements.txt',
    devCommand: "pip3 install -r requirements.txt && python -m flask run",
    runCommand: "gunicorn --workers=2 -b 0.0.0.0:5000",
    debugCommand: "pip3 install -r requirements.txt && python -m flask run",
    port: "5000",
    outputDir: '',
    staticType: "",
  },
  {
    img: "/img/application/create/express.png",
    name: 'Express',
    key: "express",
    baseImage: "node:16",
    buildCommand: 'yarn install --frozen-lockfile',
    devCommand: "yarn install && yarn start",
    runCommand: "yarn start",
    debugCommand: "yarn install && yarn start",
    port: "3000",
    outputDir: '.',
    staticType: "",
  },
  {
    img: "/img/application/create/ruby.png",
    name: 'Sinatra',
    key: "sinatra",
    baseImage: "ruby:3-buster",
    buildCommand: 'bundle install',
    devCommand: "bundle exec ruby app.rb -o 0.0.0.0",
    runCommand: "bundle exec rackup -o 0.0.0.0 -p 4567",
    debugCommand: "bundle exec ruby app.rb -o 0.0.0.0",
    port: "4567",
    outputDir: '.',
    staticType: "",
  },
  {
    img: "/img/application/create/other.svg",
    name: 'Other',
    key: "other",
    baseImage: "",
    buildCommand: '',
    devCommand: "",
    runCommand: "",
    debugCommand: "",
    port: "",
    outputDir: '',
    staticType: "",
  },
]

export const ImageList = [
  "node:16",
  "node:15",
  "node:14",
  "nginx:1.23",
  "nginx:1.22",
  "nginx:1.21",
  "golang:1.19",
  "go:1.18",
  "openjdk:18",
  "python:3.10"
]






