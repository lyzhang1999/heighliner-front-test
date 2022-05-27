import React, {createContext} from 'react'

export interface State {
  a?: string,
  b?: string,
  c?: string
}

export const initState: State = {
  a: '2',
  b: '4',
  c: '7'
}

export const reducer = (state: State, params: State) => {
  return {
    ...state,
    ...params
  };
}

// const DispatchContext = createContext<{
//   token: Token;
//   dispatchToken: React.Dispatch<any>;
// }>({
//   token: initialToken,
//   dispatchToken: () => null,
// });

export const Context = createContext<{
  dispatch: React.Dispatch<any>;
}>({
  dispatch: () => null,
});

// export const Context = React.createContext(initState);


