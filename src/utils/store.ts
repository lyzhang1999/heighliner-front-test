import React from 'react'

interface State {
  a?: string,
  b?: string,
  c?: string
}

export const initState: State = {
  a: '2',
  b: '4',
  c: '7'
}

export const reducer = (state: State, params: State ) => {
  return {
    ...state,
    ...params
  };
}
export const Context = React.createContext(null);


