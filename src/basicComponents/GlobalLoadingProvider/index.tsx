import { useState } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import { Backdrop } from "@mui/material";

import { CommonProps } from "@/utils/commonType";
import { GlobalLoadingContext } from "@/hooks/GlobalLoading";

interface Props extends CommonProps {}

export function GlobalLoadingProvider({ children }: Props) {
  const [globalLoading, setGlobalLoading] = useState(false);
  const value = { globalLoading, setGlobalLoading };

  const clickHandler = () => {
    setGlobalLoading(false);
  };

  return (
    <GlobalLoadingContext.Provider value={value}>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={globalLoading}
        // onClick={clickHandler}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {children}
    </GlobalLoadingContext.Provider>
  );
}
