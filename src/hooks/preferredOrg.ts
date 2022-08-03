import { getUserInfo } from "@/api/profile";
import { useEffect, useState } from "react";

export default function usePreferredOrg(): [
  number | undefined,
  (new_preferred_org_id?: number) => void
] {
  const [currentPreferredOrgId, setCurrentPreferredOrgId] = useState<number>();

  const flushCurrentPreferredOrgId = (new_preferred_org_id?: number) => {
    if (new_preferred_org_id !== undefined) {
      setCurrentPreferredOrgId(new_preferred_org_id);
      return;
    }

    getUserInfo().then((res) => {
      setCurrentPreferredOrgId(res.preferred_org_id);
    });
  };

  useEffect(() => {
    flushCurrentPreferredOrgId();
  }, []);

  return [currentPreferredOrgId, flushCurrentPreferredOrgId];
}
