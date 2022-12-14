/**
 * Place all contexts used by components
 */

import React, { createContext, Dispatch, MutableRefObject, SetStateAction } from "react";

import { GetArgoCDInfoRes } from "@/api/application/argo";
import { AppRepoRes } from "@/api/application";

export interface IEnvContext {
  cluster_id?: number;
  kubeconfig?: string;
  argoCDInfo?: GetArgoCDInfoRes;
  argoCDAutoSync: boolean;
  changeArgoCDAutoSync?: () => Promise<boolean>;
  argoCDReadyRef?: MutableRefObject<boolean>;
}

export const EnvContext = createContext<IEnvContext>({
  argoCDAutoSync: false,
});

export interface PanelContextValue {
  git_provider_id?: number;
  git_org_name?: string;
  owner_id?: number;
  repos?: AppRepoRes;
  prodEnvId?: number;
}

export const PanelContext = createContext<PanelContextValue>({});
