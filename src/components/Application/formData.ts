import { cloneDeep } from "lodash-es";
import { Dispatch, Reducer, useReducer } from "react";

export enum AllFieldName {
  ApplicationName = "ApplicationName",
  Cluster = "Cluster",
  StackCode = "StackCode",
  GitHubToken = "GitHubToken",
  Domain = "Domain",
}

export interface FormData {
  [index: string]: boolean | number | string | string[];
  [AllFieldName.ApplicationName]: string;
  [AllFieldName.Cluster]: string;
  [AllFieldName.StackCode]: number;
  [AllFieldName.GitHubToken]: string;
  [AllFieldName.Domain]: string;
  // Repos: string[];
  // Addons: string[];
}

export enum FieldChangeType {
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
    [AllFieldName.ApplicationName]: "My-Application",
    [AllFieldName.Cluster]: "",
    [AllFieldName.StackCode]: 0,
    [AllFieldName.GitHubToken]: "",
    [AllFieldName.Domain]: "",
  };
  return initialFormData;
}

export function useFormReducer() {
  const initialFormData = getInitialFormData();

  const reducer: Reducer<FormData, FieldAction> = (preState, action) => {
    const nextState: FormData = cloneDeep(preState);

    switch (action.type) {
      case FieldChangeType.TextInput:
        nextState[action.field] = action.payload!;
        break;
      case FieldChangeType.Toggle:
        nextState[action.field] = !preState[action.field];
        break;
    }
    console.log('nextState')
    console.log(nextState);
    return nextState;
  };

  return useReducer(reducer, initialFormData);
}

export interface FormReducerReturnType {
  formData: FormData;
  formDataDispatch: Dispatch<FieldAction>;
}
