import React, { useState, useEffect, Reducer, useReducer } from "react";
import { Button } from "@mui/material";
import { cloneDeep } from "lodash-es";

import Layout from "@/components/Layout";
import BasicApplicationInfo from "@/components/Application/BasicApplicationInfo";
import VersionControllInfo from "@/components/Application/VersionControlInfo";
import AddonInfo from "@/components/Application/AddonInfo";
import SideProgress from "@/components/Application/SideProgress";
import { ChangeStatusAction, Direction, Status } from "@/utils/constants";

import styles from "./index.module.scss";

export interface StageIndicator {
  stages: Array<Status>;
  currentStageIndex: number;
}

enum ChangeCurrentStageIndex {
  Plus,
  Minus,
}

const Stage = [
  <BasicApplicationInfo key={0} />,
  <VersionControllInfo key={1} />,
  <AddonInfo key={2} />,
];

const Create = () => {
  // Side state
  const stageNumber = 3;
  const initialStageIndicator = getInitialStageIndicator(stageNumber);
  const [stageIndicator, stageIndicatorDispatch] = useStageIndicator(
    initialStageIndicator
  );

  return (
    <Layout pageHeader="Create Application">
      <div className={styles.createApplicationWrapper}>
        <SideProgress stageIndicator={stageIndicator} className={styles.side} />
        <div className={styles.main}>
          <div className={styles.panel}>
            {Stage[stageIndicator.currentStageIndex]}
          </div>
          <div className={styles.suspendBtn}>
            <Button
              variant="outlined"
              onClick={() => {
                stageIndicatorDispatch({ type: ChangeCurrentStageIndex.Minus });
              }}
            >
              pre
            </Button>
            <Button
              variant="outlined"
              onClick={() => {
                stageIndicatorDispatch({ type: ChangeCurrentStageIndex.Plus });
              }}
            >
              next
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};
export default Create;

export function getInitialStageIndicator(
  stageNumber: number,
  currentStageIndex = 0
) {
  const initialStageIndicator: StageIndicator = {
    stages: new Array<Status>(stageNumber).fill(Status.Initial),
    currentStageIndex: currentStageIndex,
  };

  return initialStageIndicator;
}

export function useStageIndicator(initialStageIndicator: StageIndicator) {
  type _Reducer = Reducer<
    StageIndicator,
    { type: ChangeStatusAction | ChangeCurrentStageIndex }
  >;
  const reducer: _Reducer = (preState, action) => {
    const newState = cloneDeep(preState);
    const [min, max] = [0, newState.stages.length - 1];

    switch (action.type) {
      case ChangeStatusAction.ToInitial:
        newState.stages[preState.currentStageIndex] = Status.Initial;
        break;
      case ChangeStatusAction.ToExecuting:
        newState.stages[preState.currentStageIndex] = Status.Executing;
        break;
      case ChangeStatusAction.ToSuccess:
        newState.stages[preState.currentStageIndex] = Status.Success;
        break;
      case ChangeStatusAction.ToError:
        newState.stages[preState.currentStageIndex] = Status.Error;
        break;
      case ChangeCurrentStageIndex.Plus:
        const plusResult = preState.currentStageIndex + 1;
        if (plusResult <= max) {
          newState.currentStageIndex = plusResult;
        }
        break;
      case ChangeCurrentStageIndex.Minus:
        const minusResult = preState.currentStageIndex - 1;
        if (min <= minusResult) {
          newState.currentStageIndex = minusResult;
        }
        break;
    }

    return newState;
  };

  return useReducer(reducer, initialStageIndicator);
}
