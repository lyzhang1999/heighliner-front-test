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
  getState: (p: string) => void;
  dispatch: (params: State) => void;
}

export const GlobalContxtRef = createRef<null | GetStateRef>();

const GlobalContxt = (): ReactElement => {

  const {state, dispatch} = useContext(Context);

  const getState: any = useCallback((name: string): any => {
    return get(state, 'name');
  }, [state])

  useImperativeHandle(GlobalContxtRef, () => ({getState, dispatch}), [state]);

  return (<></>)
};

export default GlobalContxt;
