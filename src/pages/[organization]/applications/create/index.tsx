import React, { useState, useEffect } from "react";
import { Input, InputLabel, TextField, Typography } from "@mui/material";

import Layout from "@/components/Layout";
import BasicApplicationInfo from "@/components/Application/BasicApplicationInfo";
import VersionControllInfo from "@/components/Application/VersionControlInfo";
import Addon from "@/components/Application/Addon";
import SideProgress, { StageIndicator } from "@/components/Application/SideProgress";

import styles from "./index.module.scss";

const Stage = [
  <BasicApplicationInfo key={0} />,
  <VersionControllInfo key={1} />,
  <Addon key={2} />,
];


const Create = () => {

  const stageIndicator: StageIndicator = [
    {
      
    }
  ]

  return (
    <Layout pageHeader="Create Application">
      <SideProgress />
      <div>

      </div>
    </Layout>
  );
};
export default Create;
