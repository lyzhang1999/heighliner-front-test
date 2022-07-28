/**
 * Place all contexts used by components
 */

import React, { createContext } from "react";

export interface IEnvContext {
  cluster_id?: number;
  kubeconfig?: string;
}

export const EnvContext = createContext<IEnvContext>({});
