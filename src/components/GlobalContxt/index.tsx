import {
  ReactElement,
  createRef,
  useImperativeHandle,
  useCallback,
  useContext
} from "react";
import {Context} from "@/utils/store";

interface GetStateRef {
  getState: (p: string) => void;
  dospatch: () => void;
}

export const GlobalContxtRef = createRef<null | GetStateRef>();

const GlobalContxt = (): ReactElement => {

  const {state, dispatch} = useContext(Context);

  const getState: any = useCallback((name: string): any => {return state[name]}, [state])

  useImperativeHandle(GlobalContxtRef, () => ({getState, dispatch}), [state]);

  return (<></>)
};

export default GlobalContxt;
