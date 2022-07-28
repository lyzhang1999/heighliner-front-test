import { getEnv, GetEnvReq, GetEnvRes } from "@/api/application";
import { useEffect, useState } from "react";

export default function useEnv(req: GetEnvReq): [GetEnvRes | null, () => void] {
  const [env, setEnv] = useState<GetEnvRes | null>(null);

  const flushEnv = () => {
    getEnv(req).then((res) => {
      setEnv(res);
    });
  };

  useEffect(() => {
    flushEnv();
  }, []);

  return [env, flushEnv];
}
