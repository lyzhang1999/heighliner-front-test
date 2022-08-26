import { getAppSettings, GetAppSettingsRes } from "@/api/application/settings";
import { useEffect, useState } from "react";

export default function useAppSettings(
  app_id: number
): [GetAppSettingsRes | null, () => void] {
  const [appSettings, setAppSettings] = useState<GetAppSettingsRes | null>(
    null
  );

  const flushAppSettings = () => {
    getAppSettings({
      app_id,
    }).then((res) => {
      setAppSettings(res);
    });
  };

  useEffect(() => {
    flushAppSettings();
  }, []);

  return [appSettings, flushAppSettings];
}
