import React, {createContext} from 'react'
import { MemberType, OrgList } from './api/org'

export interface State {
  organizationList?: any[],
  currentOrganization?: OrganizationType | null,
  menuSpread?: boolean
}

export interface OrganizationType {
  created_at: string,
  id: number,
  member_type: MemberType,
  org_id: number,
  updated_at: number,
  user_id: number,
  name: string,
  type: string
}

export const initState: State = {
  organizationList: [],
  currentOrganization: null,
  menuSpread: true,
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

