import React, {createContext} from 'react'

export interface State {
  organizationList?: any[],
}

export const initState: State = {
  organizationList: [],
}

export const reducer = (state: State, params: State) => {
  return {
    ...state,
    ...params
  };
}

export const Context = createContext<{
  dispatch: React.Dispatch<any>;
}>({
  dispatch: () => null,
});

