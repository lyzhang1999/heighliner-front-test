import React, {createContext} from 'react'

export interface State {
  organizationList?: any[],
  currentOiganization?: object | OrganizationType
}

interface OrganizationType {
  created_at: string,
  id: number,
  member_type: number,
  org_id: number,
  updated_at: number,
  user_id: number,
  name: string,
  type: string
}

export const initState: State = {
  organizationList: [],
  currentOiganization: {}
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

