import {
  ReactElement,
  createRef,
  useImperativeHandle,
  useCallback,
  useContext
} from "react";
import {Context, State} from "@/utils/store";
import {get} from "lodash-es";

interface GetStateRef {
  getState: (arr: string[]) => void;
  dispatch: (params: State) => void;
}

export const GlobalContxtRef = createRef<null | GetStateRef>();

const GlobalContxt = (): ReactElement => {

  const {state, dispatch} = useContext(Context);

  const getState: any = useCallback((arr: string[]): any => {
    return get(state, arr);
  }, [state])

  useImperativeHandle(GlobalContxtRef, () => ({getState, dispatch}), [state]);

  return (<></>)
};

export default GlobalContxt;
