import {Token} from "@mui/icons-material";
import React, {createContext, useContext, useReducer} from "react";

interface Token {
  jwt: string;
};
type Reducer = (
  token: Token,
  action: { type: TokenAction; payload: Token }
) => Token;

enum TokenAction {
  Set,
  Remove,
}

const initialToken: Token = {
  jwt: "",
};

const reducer: Reducer = (token, action) => {
  switch (action.type) {
    case TokenAction.Set:
      const newState = action.payload;
      window.localStorage.setItem("token", JSON.stringify(newState));
      return newState;
    case TokenAction.Remove:
      window.localStorage.removeItem("token");
      return initialToken;
    default:
      return token;
  }
};
const useTokenReducer = () => useReducer(reducer, initialToken);

const TokenContext = createContext<{
  token: Token;
  dispatchToken: React.Dispatch<any>;
}>({
  token: initialToken,
  dispatchToken: () => null,
});
const useTokenContext = () => useContext(TokenContext);

export {TokenAction, TokenContext, useTokenReducer, useTokenContext};
