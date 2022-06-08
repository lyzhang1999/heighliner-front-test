import React, { Reducer, useReducer } from "react";
import { cloneDeep } from "lodash-es";

import Layout from "@/components/Layout";
import BasicApplicationInfo from "@/components/Application/BasicApplicationInfo";
import VersionControllInfo from "@/components/Application/VersionControlInfo";
import AddonInfo from "@/components/Application/AddonInfo";
import SideProgress from "@/components/Application/SideProgress";
import { ChangeStatusAction, Status } from "@/utils/constants";

import styles from "./index.module.scss";
import {
  FormReducerReturnType,
  useFormReducer,
} from "../../../../components/Application/formData";
import { Button } from "@mui/material";

export interface StageIndicator {
  stages: Array<Status>;
  currentStageIndex: number;
}

enum ChangeCurrentStageIndex {
  Plus,
  Minus,
}

// Use currying function to reduce duplicate formData parameters.
function stageWithFormData({
  formData,
  formDataDispatch,
}: FormReducerReturnType) {
  const Stage = [
    <BasicApplicationInfo
      key={0}
      formData={formData}
      formDataDispatch={formDataDispatch}
    />,
    <VersionControllInfo
      key={1}
      formData={formData}
      formDataDispatch={formDataDispatch}
    />,
    <AddonInfo
      key={2}
      // formData={formData}
      // formDataDispatch={formDataDispatch}
    />,
  ];

  return function (currentStageIndex: number) {
    return Stage[currentStageIndex];
  };
}

export default function Create() {
  // Side state
  const stageNumber = 3;
  const initialStageIndicator = getInitialStageIndicator(stageNumber);
  const [stageIndicator, stageIndicatorDispatch] = useStageIndicator(
    initialStageIndicator
  );

  // Form data
  const [formData, formDataDispatch] = useFormReducer();
  const getCurrentStage = stageWithFormData({ formData, formDataDispatch });

  return (
    <Layout pageHeader="Create Application">
      <div className={styles.createApplicationWrapper}>
        {/* <SideProgress stageIndicator={stageIndicator} className={styles.side} /> */}
        <div className={styles.main}>
          <div className={styles.panel}>
            {/* {getCurrentStage(stageIndicator.currentStageIndex)} */}
            {getCurrentStage(0)}
            {getCurrentStage(1)}
          </div>
          <Button variant="contained" className={styles.createBtn}>Create Application</Button>
          {/* <div className={styles.suspendBtn}>
            <button
              onClick={() => {
                stageIndicatorDispatch({ type: ChangeCurrentStageIndex.Minus });
              }}
            >
              <span className={styles.left}></span>
            </button>
            <button
              onClick={() => {
                stageIndicatorDispatch({ type: ChangeCurrentStageIndex.Plus });
              }}
            >
              <span className={styles.right}></span>
            </button>
          </div> */}
        </div>
      </div>
    </Layout>
  );
}

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

function useStageIndicator(initialStageIndicator: StageIndicator) {
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
