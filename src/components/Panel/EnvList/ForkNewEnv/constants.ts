import { EnvType, EnvVariables } from "@/api/application";

import { FieldsMap as AddGitHubIssuesFieldsMap } from "../AddGitHubIssues";

export const SharedFormFieldName = {
  ENV_TYPE: "Env Type",
  NAME: "Name",
  ISSUES: "Issues",
} as const;

export interface SharedFormFieldValues {
  [SharedFormFieldName.ENV_TYPE]: EnvType;
  [SharedFormFieldName.NAME]: string;
  [SharedFormFieldName.ISSUES]: Array<{
    [AddGitHubIssuesFieldsMap.URL]: string;
  }>;
}

const SharedFormDefaultValue = {
  [SharedFormFieldName.ENV_TYPE]: EnvType.Development,
  [SharedFormFieldName.NAME]: "",
  [SharedFormFieldName.ISSUES]: [],
};

export const WebAppFormFieldName = {
  ...SharedFormFieldName,
  START_POINT: "Start Point",
  BACKEND: "Backend",
  FRONTEND: "Frontend",
  ENV_VARIABLES: "Env Variables",
} as const;

export interface WebAppFormFieldValues extends SharedFormFieldValues {
  [WebAppFormFieldName.START_POINT]: {
    [WebAppFormFieldName.BACKEND]: string;
    [WebAppFormFieldName.FRONTEND]: string;
  };
  [WebAppFormFieldName.ENV_VARIABLES]: {
    [WebAppFormFieldName.BACKEND]: EnvVariables;
    [WebAppFormFieldName.FRONTEND]: EnvVariables;
  };
}

export const WebAppFormDefaultValue: WebAppFormFieldValues = {
  ...SharedFormDefaultValue,
  [WebAppFormFieldName.START_POINT]: {
    [WebAppFormFieldName.BACKEND]: "",
    [WebAppFormFieldName.FRONTEND]: "",
  },
  [WebAppFormFieldName.ENV_VARIABLES]: {
    [WebAppFormFieldName.BACKEND]: [],
    [WebAppFormFieldName.FRONTEND]: [],
  },
};

export const MicroServiceFormFieldName = {
  ...SharedFormFieldName,
  START_POINT: "Start Point",
  ENV_VARIABLES: "Env Variables",
  SERVICE_NAME: "Service Name",
  REPO_NAME: "Repo name",
  BRANCH_NAME: "Branch",
} as const;

export interface MicroServiceFormFieldValues extends SharedFormFieldValues {
  [MicroServiceFormFieldName.START_POINT]: Array<{
    [MicroServiceFormFieldName.SERVICE_NAME]: string;
    [MicroServiceFormFieldName.BRANCH_NAME]: string;
  }>;
  [MicroServiceFormFieldName.ENV_VARIABLES]: Array<{
    [MicroServiceFormFieldName.SERVICE_NAME]: string;
    [MicroServiceFormFieldName.ENV_VARIABLES]: EnvVariables;
  }>;
}

export const MicroServiceFormDefaultValue: MicroServiceFormFieldValues = {
  ...SharedFormDefaultValue,
  [WebAppFormFieldName.START_POINT]: [],
  [WebAppFormFieldName.ENV_VARIABLES]: [],
};
