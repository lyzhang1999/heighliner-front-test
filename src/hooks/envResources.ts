import { getEnvResources, GetEnvResourcesReq, GetEnvResourcesRes } from "@/api/application/env";
import { useEffect, useState } from "react";


export default function useEnvResources(
  req: GetEnvResourcesReq
): [GetEnvResourcesRes, (newReq?: Partial<GetEnvResourcesReq>) => void] {
  const [envResources, setEnvResources] = useState<GetEnvResourcesRes>([]);

  const flushEnvResources = (newReq?: Partial<GetEnvResourcesReq>) => {
    getEnvResources({ ...req, ...newReq }).then((res) => {
      setEnvResources(res);
    });
  };

  useEffect(() => {
    flushEnvResources();
  }, []);

  return [envResources, flushEnvResources];
}
