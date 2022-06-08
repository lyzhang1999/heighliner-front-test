import { cloneDeep } from "lodash-es";
import { Dispatch, Reducer, useReducer } from "react";

export enum AllFieldName {
  ApplicationName = "ApplicationName",
  Cluster = "Cluster",
  StackCode = "StackCode",
  GitHubToken = "GitHubToken",
  Domain = "Domain",
  GitConfig = "GitConfig",
  OrgName = "OrgName",
  GitProvider = "GitProvider",
  GitToken = "GitToken",
}

export interface GitConfig {
  [AllFieldName.OrgName]: string;
  [AllFieldName.GitProvider]: string;
  [AllFieldName.GitToken]: string;
}

export interface FormData {
  [index: string]: boolean | number | string | string[] | GitConfig;
  [AllFieldName.ApplicationName]: string;
  [AllFieldName.Cluster]: number;
  [AllFieldName.StackCode]: number;
  [AllFieldName.GitHubToken]: string;
  [AllFieldName.Domain]: string;
  [AllFieldName.GitConfig]: GitConfig;
}

export enum FieldChangeType {
  Git,
  TextInput,
  Toggle,
}

export type FormDataKey = keyof FormData;
export interface FieldAction {
  type: FieldChangeType;
  field: FormDataKey;
  payload?: FormData[FormDataKey];
}

export function getInitialFormData() {
  const initialFormData: FormData = {
    [AllFieldName.ApplicationName]: "my-application",
    [AllFieldName.Cluster]: -1,
    [AllFieldName.StackCode]: -1,
    [AllFieldName.GitHubToken]: "",
    [AllFieldName.Domain]: "",
    [AllFieldName.GitConfig]: {
      [AllFieldName.OrgName]: "",
      [AllFieldName.GitProvider]: "",
      [AllFieldName.GitToken]: "",
    },
  };
  return initialFormData;
}

export function useFormReducer() {
  const initialFormData = getInitialFormData();

  const reducer: Reducer<FormData, FieldAction> = (preState, action) => {
    const nextState: FormData = cloneDeep(preState);

    switch (action.type) {
      case FieldChangeType.Git:
        nextState[AllFieldName.GitConfig] = action.payload as GitConfig;
        break;
      case FieldChangeType.TextInput:
        nextState[action.field] = action.payload!;
        break;
      case FieldChangeType.Toggle:
        nextState[action.field] = !preState[action.field];
        break;
    }
    console.log("nextState");
    console.log(nextState);
    return nextState;
  };

  return useReducer(reducer, initialFormData);
}

export interface FormReducerReturnType {
  formData: FormData;
  formDataDispatch: Dispatch<FieldAction>;
}
