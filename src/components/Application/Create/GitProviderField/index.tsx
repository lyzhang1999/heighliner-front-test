import React, { useState } from "react";
import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  Stack,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { Control, Controller, FieldError } from "react-hook-form";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";
import { formatDate } from "@/utils/utils";
import GitHubSVG from "/public/img/gitprovider/GITHUB.svg";
import AddGitProvider, {
  AddGitProviderSuccessCb,
} from "@/components/AddGitProvider";
import useGitProviders from "@/hooks/gitProviders";
import { GitProvider } from "@/api/gitProviders";

import styles from "./index.module.scss";

interface Props extends CommonProps {
  name: string;
  control: Control;
  error: FieldError;
}

export default function GitProviderField(props: Props): React.ReactElement {
  const [openAddGitProviderDrawer, setOpenAddGitProviderDrawer] =
    useState(false);
  const addGitProviderSuccessCb: AddGitProviderSuccessCb = (
    gitProviderItem
  ) => {
    // getGitProviderList();
    // setValue(fieldsMap.gitProvider, gitProviderItem.id.toString());
  };
  const [gitProviderList, getGitProviderList] = useGitProviders();

  return (
    <>
      <Controller
        name={props.name}
        control={props.control}
        render={({ field }) => (
          <FormControl
            error={props.error ? true : false}
            className={styles.gitProviderWrapper}
            sx={{
              display: "grid",
            }}
          >
            <h2>
              {props.name}
              <span className={styles.star}>*</span>
            </h2>
            <div>
              <Select
                value={field.value}
                onChange={(e) => {
                  if (e.target.value === "new") {
                    setOpenAddGitProviderDrawer(true);
                  } else {
                    field.onChange(e);
                  }
                }}
                displayEmpty
                inputProps={{ "aria-label": "Without label" }}
                className={clsx(styles.gitProviderSelect)}
              >
                {gitProviderList.map(
                  ({ git_provider_id, git_org_name, provider, created_at }) => (
                    <MenuItem
                      key={git_provider_id}
                      value={git_provider_id}
                      className={styles.gitProviderItem}
                      placeholder="Please choose a git provider."
                    >
                      {provider === GitProvider.GitHub && <GitHubSVG />}
                      <Stack>
                        <div className={styles.gitOrgname}>{git_org_name}</div>
                        <div className={styles.gitProviderUpdate}>
                          {formatDate(created_at * 1000)}
                        </div>
                      </Stack>
                    </MenuItem>
                  )
                )}
                <MenuItem value={"new"} className={styles.gitProviderItem}>
                  <AddCircleOutlineIcon />
                  Add
                </MenuItem>
              </Select>
              <FormHelperText id="my-helper-text">
                {props.error && props.error.message}
              </FormHelperText>
            </div>
          </FormControl>
        )}
        rules={{
          required: "Please choose a git provider.",
        }}
      />
      <AddGitProvider
        setModalDisplay={setOpenAddGitProviderDrawer}
        modalDisplay={openAddGitProviderDrawer}
        successCb={addGitProviderSuccessCb}
      />
    </>
  );
}
