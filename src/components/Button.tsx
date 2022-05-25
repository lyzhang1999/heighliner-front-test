/**
 * Button Component
 */

import React from "react";
import Button from '@mui/material/Button';

import { AccessAlarm } from "@mui/icons-material";

export function Btn(): React.ReactElement {
  return (
    <div>
      <h1>Hello, world btn</h1>
      <main>
        <Button startIcon={<AccessAlarm />} variant='contained'>Hello ,world</Button>
      </main>
    </div>
  )
}
