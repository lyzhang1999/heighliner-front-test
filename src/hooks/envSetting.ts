import { useEffect, useState } from "react";

import {
  getEnvSetting,
  GetEnvSettingReq,
  GetEnvSettingRes,
} from "@/api/application";

export default function useEnvSetting(
  req: GetEnvSettingReq
): [GetEnvSettingRes | null, () => void] {
  const [envSetting, setEnvSetting] = useState<GetEnvSettingRes | null>(null);

  const flushEnvSetting = () => {
    getEnvSetting(req).then((res) => {
      setEnvSetting(res);
    });
  };

  useEffect(() => {
    flushEnvSetting();
  }, []);

  return [envSetting, flushEnvSetting];
}
