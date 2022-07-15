import {
  getGitProviderOrganizations,
  GitProviderOrganizations,
} from "@/api/gitProviders";
import { useState } from "react";

export default function useGitProviderOrganizations(): [
  GitProviderOrganizations | undefined,
  (gitProviderId: number) => void
] {
  const [gitProviderOrganizations, setGitProviderOrganizations] =
    useState<GitProviderOrganizations>();

  const updateGitProviderOrganizations = (gitProviderId: number) => {
    getGitProviderOrganizations(gitProviderId).then((res) => {
      setGitProviderOrganizations(res);
    });
  };

  return [gitProviderOrganizations, updateGitProviderOrganizations];
}
