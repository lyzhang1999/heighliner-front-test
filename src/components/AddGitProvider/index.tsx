import React, { Dispatch, SetStateAction, useState } from "react";
import { Drawer, Tab } from "@mui/material";
import { TabContext, TabList, TabPanel } from "@mui/lab";

import { createProviderList } from "@/utils/api/gitProvider";
import { Message } from "@/utils/utils";
import Btn, { BtnType } from "@/components/Btn";

import styles from "./index.module.scss";
import GitHubApp from "./GitHubApp";
import GitHubPAT from "./GitHubPAT";

interface Props {
  modalDisplay: boolean;
  setModalDisplay: Dispatch<SetStateAction<boolean>>;
  successCb?: Function;
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
  const [gitProviderOrgName, setGitProviderOrgName] = useState<string>("");
  const [token, setToken] = useState<string>("");

  const handleConfirm = () => {
    if (!gitProviderOrgName) {
      Message.error("Please input GitHub organization name");
      return;
    }
    if (!token) {
      Message.error("Please input GitHub personal access token");
      return;
    }

    createProviderList({
      git_org_name: gitProviderOrgName,
      provider: "GITHUB",
      token: token,
    }).then((res) => {
      Message.success("Add Git provider personal access token successfully");
      setModalDisplay(false);
      successCb && successCb();
    });
  };

  return (
    <div className={styles.drawer}>
      <Drawer
        anchor="right"
        open={modalDisplay}
        sx={{
          root: { borderTopLeftRadius: "14px", border: "1px solid black" },
        }}
      >
        <div className={styles.drawerWrap}>
          <div className={styles.header}>Add Git Provider</div>
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
                  token,
                  setToken,
                  gitProviderOrgName,
                  setGitProviderOrgName,
                  modalDisplay,
                  setModalDisplay,
                }}
              />
            </TabPanel>
            <TabPanel value={AddType.AddGitHubOrganization}>
              <GitHubApp {...{ setModalDisplay }} />
            </TabPanel>
            <div className={styles.bottom}>
              <TabPanel value={AddType.AddGitHubPAT}>
                <Btn style={{ marginRight: "87px" }} onClick={handleConfirm}>
                  CREATE
                </Btn>
              </TabPanel>
              <Btn type={BtnType.gray} onClick={() => setModalDisplay(false)}>
                CANCEL
              </Btn>
            </div>
          </TabContext>
        </div>
      </Drawer>
    </div>
  );
}