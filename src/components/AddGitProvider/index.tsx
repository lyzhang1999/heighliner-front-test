import React, { Dispatch, SetStateAction, useState } from "react";
import { Button, Drawer, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import RightDrawer from "@/basicComponents/RightDrawer";

import styles from "./index.module.scss";
import GitHubApp from "./GitHubApp";
import GitHubPAT from "./GitHubPAT";
import { GitProviderItem } from "@/api/gitProviders";

export type AddGitProviderSuccessCb = (
  newGitProviderItem: GitProviderItem
) => void;

interface Props {
  modalDisplay: boolean;
  setModalDisplay: Dispatch<SetStateAction<boolean>>;
  successCb?: AddGitProviderSuccessCb;
}

enum AddType {
  AddGitHubOrganization = "Add GitHub Organization",
  AddGitHubPAT = "Add GitHub PAT",
}

export default function AddGitProvider({
  modalDisplay,
  setModalDisplay,
  successCb,
}: Props) {
  const [tabValue, setTabValue] = useState(AddType.AddGitHubOrganization);

  return (
    <div className={styles.drawer}>
      <RightDrawer
        {...{
          modalDisplay,
          setModalDisplay,
          title: "Add Git Provider",
        }}
      >
        <TabContext value={tabValue}>
          <TabList
            onChange={(event: React.SyntheticEvent, newAddType: AddType) => {
              setTabValue(newAddType);
            }}
          >
            <Tab
              label={AddType.AddGitHubOrganization}
              value={AddType.AddGitHubOrganization}
            />
            <Tab label={AddType.AddGitHubPAT} value={AddType.AddGitHubPAT} />
          </TabList>
          <TabPanel value={AddType.AddGitHubPAT}>
            <GitHubPAT
              {...{
                modalDisplay,
                setModalDisplay,
                successCb,
              }}
            />
          </TabPanel>
          <TabPanel value={AddType.AddGitHubOrganization}>
            <GitHubApp {...{ setModalDisplay, successCb }} />
          </TabPanel>
        </TabContext>
      </RightDrawer>
    </div>
  );
}
