import React, {createContext} from 'react'
import {getRepoListRes} from "@/api/application";
import {
  BackendFrameWorkInitState,
  FrameworkType, FrontendFrameWorkInitState,
  FrontendType, MicroServiceInitData, MiddleWaresInitState,
  MiddleWareType, NetworkInitData, ProvidersInitState,
  ProvidersType, SelectAStackInitState,
  SelectAStackType
} from "@/components/Application/Create/util";
import {cloneDeep} from "lodash-es";
import {ClusterItem} from "@/api/cluster";
import {GitProviderOrganizations} from "@/api/gitProviders";

export interface FormStateType {
  selectAStack?: SelectAStackType,
  providers?: ProvidersType,
  backend?: FrameworkType,
  frontend?: FrontendType,
  middleWares?: MiddleWareType[],
  microService?: any[],
  networkData?: any[]
}

export interface State {
  repoList?: getRepoListRes[] | boolean;
  index?: number,
  formState?: FormStateType,
  submitFun?: Function | null,
  clusterList?: ClusterItem[],
  gitProviderOrganizations?: GitProviderOrganizations,
}

export const initState: State = {
  repoList: false,
  index: 1,
  formState: {
    selectAStack: cloneDeep(SelectAStackInitState),
    providers: cloneDeep(ProvidersInitState),
    backend: cloneDeep(BackendFrameWorkInitState),
    frontend: cloneDeep(FrontendFrameWorkInitState),
    middleWares: cloneDeep(MiddleWaresInitState),
    microService: [cloneDeep(MicroServiceInitData)],
    networkData: [cloneDeep(NetworkInitData)],
  },
  clusterList: [],
  gitProviderOrganizations: [],
}

export const reducer = (state: State, params: State) => {
  return {
    ...state,
    ...params
  };
}

export const CreateContext = createContext<{
  dispatch: React.Dispatch<any>;
  state: State;
}>({
  dispatch: () => null,
  state: initState,
});

export default function test() {
  return <></>
}
