import { getProdEnv, GetProdEnvRes } from "@/api/application";
import { useEffect, useState } from "react";

export function useEnvProd(app_id: number): [GetProdEnvRes | null, () => void] {
  const [envProd, setEnvProd] = useState<GetProdEnvRes | null>(null);

  const flushEnvProd = () => {
    getProdEnv(String(app_id)).then((res) => {
      setEnvProd(res);
    });
  };

  useEffect(() => {
    flushEnvProd();
  }, []);

  return [envProd, flushEnvProd];
}
