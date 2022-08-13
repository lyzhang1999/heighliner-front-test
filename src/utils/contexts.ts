/**
 * Place all contexts used by components
 */

import React, { createContext, Dispatch, MutableRefObject, SetStateAction } from "react";

import { GetArgoCDInfoRes } from "@/api/application/argo";

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
