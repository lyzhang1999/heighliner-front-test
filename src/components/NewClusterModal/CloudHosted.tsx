/**
 * Cloud provider hosted k8s cluster.
 */

import { Stack, Typography } from "@mui/material";
import DeveloperBoardOffIcon from "@mui/icons-material/DeveloperBoardOff";
import React from "react";

interface Props {}
export const CloudHostedPanel = ({}: Props) => {
  return (
    <Stack direction="row" gap="8px">
      <div
        style={{
          color: "rgba(0, 0, 0, 0.6)",
        }}
      >
        <DeveloperBoardOffIcon />
      </div>
      <Typography
        sx={{
          color: "rgba(0, 0, 0, 0.6)",
        }}
      >
        Cloud hosted cluster is still working in progress.
      </Typography>
    </Stack>
  );
};
