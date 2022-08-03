import { getUserInfo } from "@/api/profile";
import { useEffect, useState } from "react";

export default function useDefaultOrg(): [
  number | undefined,
  (new_default_org_id?: number) => void
] {
  const [currentDefaultOrgId, setCurrentDefaultOrgId] = useState<number>();

  const flushCurrentDefaultOrgId = (new_default_org_id?: number) => {
    if (new_default_org_id !== undefined) {
      setCurrentDefaultOrgId(new_default_org_id);
      return;
    }

    getUserInfo().then((res) => {
      setCurrentDefaultOrgId(res.default_org_id);
    });
  };

  useEffect(() => {
    flushCurrentDefaultOrgId();
  }, []);

  return [currentDefaultOrgId, flushCurrentDefaultOrgId];
}
