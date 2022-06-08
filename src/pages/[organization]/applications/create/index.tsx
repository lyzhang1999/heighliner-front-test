import React, { Reducer, useReducer, useState } from "react";
import { cloneDeep } from "lodash-es";

import Layout from "@/components/Layout";
import BasicApplicationInfo from "@/components/Application/BasicApplicationInfo";
import VersionControllInfo from "@/components/Application/VersionControlInfo";
import AddonInfo from "@/components/Application/AddonInfo";
import SideProgress from "@/components/Application/SideProgress";
import { ChangeStatusAction, Status } from "@/utils/constants";

import styles from "./index.module.scss";
import {
  AllFieldName,
  FormReducerReturnType,
  useFormReducer,
} from "../../../../components/Application/formData";
import { Alert, Button } from "@mui/material";
import { NoticeRef } from "@/components/Notice";
import {
  createApplication,
  CreateApplicationRequest,
  CreateApplicationResponse,
} from "@/utils/api/application";
import { useRouter } from "next/router";
import { getOriginzationByUrl } from "@/utils/utils";

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
  const router = useRouter();

  // Form data
  const [formData, formDataDispatch] = useFormReducer();
  const getCurrentStage = stageWithFormData({ formData, formDataDispatch });

  const createApplicationHandler = () => {
    // Validate all fields
    // for (const [fieldName, fieldValue] of Object.entries(formData)) {
    //   console.log(typeof fieldName);
    //   if ((typeof fieldValue === "string" && fieldValue.length <= 0) ||
    //   (typeof fieldValue === "number" && fieldValue < 0)
    //   ) {
    //     NoticeRef.current?.open({
    //       message: `Please check ${fieldName} item.`,
    //       type: "error",
    //     });
    //     return;
    //   }
    // }
    const createApplicationRequest: CreateApplicationRequest = {
      cluster_id: formData[AllFieldName.Cluster],
      git_config: {
        org_name: formData[AllFieldName.GitConfig][AllFieldName.OrgName],
        provider: formData[AllFieldName.GitConfig][AllFieldName.GitProvider],
        token: formData[AllFieldName.GitConfig][AllFieldName.GitToken],
      },
      name: formData[AllFieldName.ApplicationName],
      networking: {
        domain: formData[AllFieldName.Domain],
      },
      stack_id: formData[AllFieldName.StackCode],
    };

    createApplication(createApplicationRequest).then((res) => {
      router.push(
        `/${getOriginzationByUrl()}/applications/creating?app_id=${
          res.app_id
        }&release_id=${res.release_id}`
      );
    });
  };

  return (
    <Layout pageHeader="Create Application">
      <div className={styles.createApplicationWrapper}>
        <div className={styles.main}>
          <div className={styles.panel}>
            {getCurrentStage(0)}
            {getCurrentStage(1)}
          </div>
          <Button
            variant="contained"
            className={styles.createBtn}
            onClick={createApplicationHandler}
          >
            Create Application
          </Button>
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
