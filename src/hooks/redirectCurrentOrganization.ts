import { getOrgList } from "@/api/org";
import { Context } from "@/utils/store";
import { getCurrentOrg, getDefaultOrg } from "@/utils/utils";
import { useRouter } from "next/router";
import { useContext } from "react";

export default function useRedirectCurrentOrganization() {
  const { dispatch } = useContext(Context);
  const router = useRouter();

  const redirectCurrentOrganization = () => {
    getOrgList().then((res) => {
      let list = res.data;
      dispatch({
        organizationList: list,
        currentOrganization: getCurrentOrg(getDefaultOrg(list)),
      });
      let oriName = encodeURIComponent(list[0]?.name);
      router.push(`${oriName}/applications`);
    });
  };

  return redirectCurrentOrganization;
}
