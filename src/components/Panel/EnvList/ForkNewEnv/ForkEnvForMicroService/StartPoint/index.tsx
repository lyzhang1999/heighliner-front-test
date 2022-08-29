import React, { useContext, useState } from "react";
import clsx from "clsx";
import { Control, Controller, FieldError } from "react-hook-form";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";
import {
  MicroServiceFormFieldName,
  MicroServiceFormFieldValues,
} from "../../constants";
import { PanelContext } from "@/utils/contexts";
import { HeadlineTwo, HeadTitle2 } from "../../Piece";
import { FormControl, FormHelperText, MenuItem, Select } from "@mui/material";
import {
  getBranches,
  GetBranchesReq,
  GetBranchesRes,
} from "@/api/gitProviders";
import { cloneDeep } from "lodash-es";
import Selector from "@/basicComponents/Selector";

interface Props extends CommonProps {
  control: Control<MicroServiceFormFieldValues>;
  error:
  | Array<{
    [MicroServiceFormFieldName.BRANCH_NAME]?: FieldError;
  }>
  | undefined;
}

export default function StartPoint({
  control,
  error,
}: Props): React.ReactElement {
  const panelContext = useContext(PanelContext);
  const [selectableBranches, setSelectableBranches] = useState<{
    [key: string]: GetBranchesRes;
  }>();

  const handleOpenSelect =
    (repo_name: GetBranchesReq["repo_name"]) => async () => {
      if (selectableBranches && selectableBranches[repo_name]) {
        return;
      }

      const res = await getBranches({
        git_provider_id: panelContext.git_provider_id!,
        owner_name: panelContext.git_org_name!,
        repo_name: repo_name,
      });

      setSelectableBranches((preState) => {
        const nextState = cloneDeep(preState) || {};
        nextState[repo_name] = res;

        return nextState;
      });
    };

  return (
    <div>
      <Controller
        name={MicroServiceFormFieldName.START_POINT}
        control={control}
        render={({ field: startPoints }) => (
          <>
            {startPoints.value.map((startPoint, index) => (
              <div className={styles.wrap} key={index}>
                <HeadTitle2
                  toolTipTitle={
                    startPoint[MicroServiceFormFieldName.SERVICE_NAME]
                  }
                >
                  <span>
                    {startPoint[MicroServiceFormFieldName.SERVICE_NAME]}
                  </span>
                </HeadTitle2>
                <Controller
                  key={index}
                  name={`${MicroServiceFormFieldName.START_POINT}.${index}.${MicroServiceFormFieldName.BRANCH_NAME}`}
                  control={control}
                  render={({ field }) => (
                    <FormControl
                      error={
                        error &&
                        error[index] &&
                        error[index][MicroServiceFormFieldName.BRANCH_NAME] !==
                        undefined
                      }
                    >
                      <Selector
                        filterProps={{ size: "small" }}
                        List={
                          !selectableBranches ||
                            !selectableBranches[
                            startPoint[MicroServiceFormFieldName.SERVICE_NAME]
                            ] ? [{
                              value: startPoint[MicroServiceFormFieldName.BRANCH_NAME],
                              key: startPoint[MicroServiceFormFieldName.BRANCH_NAME]
                            }] :
                            selectableBranches[
                              startPoint[MicroServiceFormFieldName.SERVICE_NAME]
                            ].map((branch) => ({
                              key: branch.name,
                              value: branch.name
                            }))
                        }
                        onChange={field.onChange}
                        defaultValue={field.value}
                        onOpen={handleOpenSelect(
                          startPoint[MicroServiceFormFieldName.SERVICE_NAME]
                        )}
                      >

                      </Selector>

                      <FormHelperText>
                        {error &&
                          error[index] &&
                          error[index][MicroServiceFormFieldName.BRANCH_NAME] &&
                          error[index][MicroServiceFormFieldName.BRANCH_NAME]
                            ?.message}
                      </FormHelperText>
                    </FormControl>
                  )}
                />
              </div>
            ))}
          </>
        )}
      />
    </div>
  );
}
