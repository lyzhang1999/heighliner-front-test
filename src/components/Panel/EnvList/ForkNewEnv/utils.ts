import { GetBranchesRes } from "@/api/gitProviders";

export function parseDefaultBranchName(data: GetBranchesRes) {
  const defaultBranches = ["main", "master"];
  const result = data.filter((datum) => {
    return defaultBranches.includes(datum.name.toLowerCase());
  });

  return result[0].name;
}
