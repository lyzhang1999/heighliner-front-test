import {
  getApplicationInfo,
  GetApplicationInfoReq,
  GetApplicationInfoRes,
} from "./../api/application";
import { useEffect, useState } from "react";

export default function useApplication(
  req: GetApplicationInfoReq
): [GetApplicationInfoRes | null, () => void] {
  
  const [application, setApplication] = useState<GetApplicationInfoRes | null>(
    null
  );

  const flushApplication = () => {
    getApplicationInfo(req).then((res) => {
      setApplication(res);
    });
  };

  useEffect(() => {
    flushApplication();
  }, []);

  return [application, flushApplication];
}
