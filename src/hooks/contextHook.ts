import {useContext} from "react";
import {Context} from "@/utils/store";

export default function ContextHook() {
  const {state, dispatch} = useContext(Context);
  return {state, dispatch};
}
