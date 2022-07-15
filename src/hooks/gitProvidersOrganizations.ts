import {
  getGitProviderOrganizations,
  GitProviderOrganizations,
} from "@/api/gitProviders";
import { useEffect, useState } from "react";

export default function useGitProviderOrganizations(): [
  GitProviderOrganizations,
  () => void
] {
  const [gitProviderOrganizations, setGitProviderOrganizations] =
    useState<GitProviderOrganizations>([]);

  useEffect(() => {
    getGitProviderOrganizations().then((res) => {
      setGitProviderOrganizations(res);
    });
  }, []);

  const updateGitProviderOrganizations = () => {
    getGitProviderOrganizations().then((res) => {
      setGitProviderOrganizations(res);
    });
  };

  return [gitProviderOrganizations, updateGitProviderOrganizations];
}
