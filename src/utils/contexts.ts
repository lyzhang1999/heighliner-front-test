/**
 * Place all contexts used by components
 */

import React, { createContext, Dispatch, SetStateAction } from "react";

import { GetArgoCDInfoRes } from "@/api/application/argo";

export interface IEnvContext {
  cluster_id?: number;
  kubeconfig?: string;
  argoCDInfo?: GetArgoCDInfoRes;
  argoCDAutoSync: boolean;
  changeArgoCDAutoSync?: () => void;
}

export const EnvContext = createContext<IEnvContext>({
  argoCDAutoSync: false,
});
