import { createContext, Dispatch, SetStateAction, useContext } from "react";

export const GlobalLoadingContext = createContext<{
  globalLoading: boolean;
  setGlobalLoading: Dispatch<SetStateAction<boolean>>;
}>({
  globalLoading: false,
  setGlobalLoading: () => {},
});

export function useGlobalLoading() {
  const context = useContext(GlobalLoadingContext);
  if (!context) {
    throw new Error("useLoading must be used within LoadingProvider");
  }
  return context;
}
