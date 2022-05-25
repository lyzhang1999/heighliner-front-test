import { Box } from "@mui/material";
import React from "react";

interface Props {
  children?: React.ReactNode
}

/**
 * Vertically and horizontally centered position in the page
 */
export default function PageCenter({children} : Props) {
  return (
    <Box className="h-100vh flex justify-center items-center">
      <Box className="flex flex-col justify-center">{children}</Box>
    </Box>
  );
}
