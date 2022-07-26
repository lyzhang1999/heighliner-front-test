import {
  getBranches,
  GetBranchesReq,
  GetBranchesRes,
} from "./../api/gitProviders";
import { useEffect, useState } from "react";

export function useBranches(
  getBranchesReq: GetBranchesReq
): [branches: GetBranchesRes, flushBranches: () => void] {
  const [branches, setBranches] = useState<GetBranchesRes>([]);

  const flushBranches = () => {
    getBranches(getBranchesReq).then((res) => {
      setBranches(res);
    });
  };

  useEffect(() => {
    flushBranches();
  }, []);

  return [branches, flushBranches];
}
