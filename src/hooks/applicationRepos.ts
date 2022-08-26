import { AppRepoRes, getApplicationRepos } from "@/api/application";
import { useEffect, useState } from "react";

export function useApplicationRepos(
  app_id: string
): [AppRepoRes, () => void] {
  const [applicationRepos, setApplicationRepos] = useState<AppRepoRes>([]);

  const flushApplicationRepos = () => {
    getApplicationRepos(app_id).then((res) => {
      setApplicationRepos(res);
    });
  };

  useEffect(() => {
    flushApplicationRepos();
  }, []);

  return [applicationRepos, flushApplicationRepos];
}
