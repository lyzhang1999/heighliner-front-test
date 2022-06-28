import { useEffect, useState } from "react";
import { getGitProviderList, GitProviderList } from "@/utils/api/gitProviders";

export default function useGitProviders(): [
  GitProviderList,
  () => void
] {
  const [gitProviderList, setGitProviderList] = useState<GitProviderList>([]);

  function getGitProviders() {
    getGitProviderList().then((res) => {
      setGitProviderList(res);
    });
  }

  useEffect(() => {
    getGitProviders();
  }, []);

  return [gitProviderList, getGitProviders];
}
