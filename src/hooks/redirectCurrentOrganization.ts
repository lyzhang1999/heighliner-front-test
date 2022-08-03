import { getOrgList } from "@/api/org";
import { Context } from "@/utils/store";
import { getCurrentOrg, getDefaultOrg } from "@/utils/utils";
import { useRouter } from "next/router";
import { useContext } from "react";
import { get } from "lodash-es";
import usePreferredOrg from "./preferredOrg";
import { getUserInfo } from "@/api/profile";

export default function useRedirectCurrentOrganization() {
  const [currentPreferredOrgId, flushCurrentPreferredOrgId] = usePreferredOrg();
  const { dispatch } = useContext(Context);
  const router = useRouter();

  const redirectCurrentOrganization = () => {
    getOrgList()
      .then((res) => {
        let list = res.data;
        let oriName = list[0]?.name;
        let currentOrganization = getCurrentOrg(getDefaultOrg(list));

        getUserInfo().then((userInfo) => {
          // Check user whether have preferred organization.
          if (
            userInfo.preferred_org_id !== undefined &&
            userInfo.preferred_org_id > 0
          ) {
            const result = list.filter(
              (item) => item.id === userInfo.preferred_org_id
            );
            // If preferred organization exist:
            if (result && result.length === 1) {
              oriName = result[0].name;
              currentOrganization = getCurrentOrg(result[0]);
            }
          }

          dispatch({
            organizationList: list,
            currentOrganization,
          });
          router.push(`${encodeURIComponent(oriName)}/applications`);
        });
      })
      .catch((err) => {
        getOrgErr(err);
      });
  };
  return redirectCurrentOrganization;
}

export function getOrgErr(err): void {
  if (
    get(err, "response.status") === 302 &&
    get(err, "response.data.redirect_to") === "userInfoComplete" &&
    location.pathname !== "/sign-up"
  ) {
    location.href = location.origin + "/sign-up?completeInfo=true";
  }
}
