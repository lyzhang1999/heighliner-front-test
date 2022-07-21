import backEnd from "@/components/Application/Create/BackEnd";

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
  "cluster_id": 4,
  "git_config": {
    "git_org_name": "ni9ht-org",
    "git_provider_id": 1
  },
  "middleware": [
    {
      "Service": [
        "test-stack-ysz-11-backend"
      ],
      "name": "pg",
      "password": "admin",
      "setting": {
        "storage": "10Gi"
      },
      "type": "postgres",
      "username": "admin"
    }
  ],
  "name": "test-stack-ysz-11",
  "service": [
    {
      "framework": {
        "name": "gin",
        "version": "1.7.7"
      },
      "language": {
        "name": "golang",
        "version": "1.17"
      },
      "name": "",
      "scaffold": true,
      "setting": {
        "env": [
          {
            "name": "TEST_ENV_KEY",
            "value": "vadf123"
          }
        ],
        "expose": [
          {
            "paths": [
              {"path": "/api"}
            ],
            "port": 8000,
            "rewrite": true
          }
        ],
        "extended_fields": {
          "entry_file": ""
        },
        "repo_url": ""
      },
      "type": "backend"
    },
    {
      "framework": {
        "name": "nextjs",
        "version": "1.7.7"
      },
      "language": {
        "name": "typescript",
        "version": "1.8"
      },
      "name": "",
      "scaffold": true,
      "setting": {
        "env": [
          {
            "name": "TEST_FRONTEND_ENV",
            "value": "aadf34"
          }
        ],
        "expose": [
          {
            "paths": [
              {"path": "/"}
            ],
            "port": 80,
            "rewrite": false
          }
        ],
        "extended_fields": {
          "entry_file": ""
        },
        "repo_url": ""
      },
      "type": "frontend"
    }
  ]
}

const componentInitState1 = {
  name: '',
  stack: 'web-application'
}

const componentInitState2 = {
  cluster_id: "",
  git_config: {
    git_org_name: '',
    git_provider_id: '',
  }
}

export const FieldsMap = {
  stack: "Stack",
  name: "Name",
  gitProvider: "Git Provider",
  clusterProvider: "Cluster Provider",
};

export const SelectAStackInitState = {
  [FieldsMap.name]: "",
  [FieldsMap.stack]: "",
}

export type SelectAStackType = typeof SelectAStackInitState;

export interface BackendType {
  isRepo: boolean,
  framework: string,
  repo_url: string,
  env: Array<{ name: string, value: string }>,
  exposePort: string,
  path: Array<{ v: string }>,
  rewrite: false,
  entryFile: string,
}

export const BackendInitState: BackendType = {
  isRepo: false,
  framework: '',
  repo_url: '',
  env: [],
  exposePort: '',
  path: [{v: '/'}],
  rewrite: false,
  entryFile: '',
}

const initData = {
  ...componentInitState1,
  ...componentInitState2,
  service: []
};


export default initData;
