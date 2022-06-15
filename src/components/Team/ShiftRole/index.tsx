import { MenuItem, Select } from "@mui/material";
import React from "react";

export default function ShiftRole(): React.ReactElement {
  return (
    <Select label="Shift Role">
      <MenuItem>Be Admin</MenuItem>
      <MenuItem>Be member</MenuItem>
    </Select>
  );
}
