import { useEffect, useState } from "react";

import {
  getEnvGitHubIssues,
  GetEnvGitHubIssuesRes,
} from "@/api/application/GitHubIssues";

export default function useGitHubIssues(
  req: Parameters<typeof getEnvGitHubIssues>[0]
): [GetEnvGitHubIssuesRes | null, () => void] {
  const [envGitHubIssues, setEnvGitHubIssues] =
    useState<GetEnvGitHubIssuesRes | null>(null);

  const flushEnvGitHubIssues = () => {
    getEnvGitHubIssues(req).then((res) => {
      setEnvGitHubIssues(res);
    });
  };

  useEffect(() => {
    flushEnvGitHubIssues();
  }, []);

  return [envGitHubIssues, flushEnvGitHubIssues];
}
