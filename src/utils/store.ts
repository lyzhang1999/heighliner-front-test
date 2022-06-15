import React, {createContext} from 'react'
import {OrgList} from "@/utils/api/org";

export interface OrganizationType {
  created_at: string,
  id: number,
  member_type: number,
  org_id: number,
  updated_at: number,
  user_id: number,
  name: string,
  type: string
}

export interface State {
  organizationList?: OrgList[],
  currentOrganization?: object | OrganizationType
}

export const initState: State = {
  organizationList: [],
  currentOrganization: {}
}

export const reducer = (state: State, params: State) => {
  return {
    ...state,
    ...params
  };
}

export const Context = createContext<{
  dispatch: React.Dispatch<any>;
  state: State;
}>({
  dispatch: () => null,
  state: initState,
});

