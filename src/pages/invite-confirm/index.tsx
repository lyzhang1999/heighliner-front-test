import PageWrapper from "@/components/PageWrapper";
import {getQuery, setLoginToken} from "@/utils/utils";
import {useEffect, useState} from "react";
import {confirmJoin, getInviteInfo} from "@/api/org";
import {getUserInfo} from "@/api/profile";
import {get} from "lodash-es";
import {deleteToken, getToken} from "@/utils/token";

export default function InviteConfirm() {
  let token = getQuery('token');
  let [errMessage, setErrMessage] = useState('');
  let [orgName, setOrgName] = useState('');

  useEffect(() => {
    if (getToken()) {
      getUserInfo().then(res => {
        getInviteInfoFun(res.email);
      }).catch(err => {
        deleteToken();
        getInviteInfoFun(undefined);
      })
    } else {
      getInviteInfoFun(undefined);
    }
  }, [])

  function getInviteInfoFun(currentEmail: (string | undefined)) {
    getInviteInfo(token).then(res => {
      let inviteEmail = get(res, 'email', null);
      if ((inviteEmail !== currentEmail) && currentEmail) {
        setErrMessage("Sorry, current user isn`t the invited user. Please retry after logout.")
      } else {
        setOrgName(res.org_name);
      }
    })
  }

  function join() {
    confirmJoin(token).then(res => {
      setLoginToken(res.token, res.expire_in);
      location.href = location.origin;
    })
  }

  if (errMessage) {
    return (
      <PageWrapper
        title="Error"
        desc={errMessage}
        btnDesc={"Logout"}
        btnCb={() => {
          deleteToken();
          location.reload();
        }}
      >
      </PageWrapper>
    )
  }

  if (orgName) {
    return (
      <PageWrapper
        title={`Join ${orgName}`}
        desc={`You are invited to join ${orgName} organization`}
        btnDesc={"Join"}
        btnCb={join}
      >
      </PageWrapper>
    )
  }
}
