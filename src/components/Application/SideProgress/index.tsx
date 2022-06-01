import { Box } from "@mui/material";
import { useReducer } from "react";

import { ChangeStatusAction, Status } from "@/utils/constants";

interface StageIndicator {
  stages: {
    [index: number]: Status
  };
  currentStageIndex: number;
}

interface Props {
  stageIndicator: StageIndicator;
}

export default function SideProgress({
  stageIndicator,
}: Props): React.ReactElement {
  return (
    <Box>
      <ul></ul>
    </Box>
  );
}



export function useStageIndicator(stageNumber: number, currentStageIndex = 0) {
  const initialStageIndicator: StageIndicator = {
    stages: new Array(stageNumber).fill({
      status: Status.Initial
    }),
    currentStageIndex: currentStageIndex
  }

  function reducer(state: StageIndicator, action) {
    switch(action.type) {
      case ChangeStatusAction.ToInitial:
        state[state.currentStageIndex] = Status.Initial;
        break;
    }
  }

  const stageIndicatorReducer = useReducer(reducer);


      
}

export { type StageIndicator };
