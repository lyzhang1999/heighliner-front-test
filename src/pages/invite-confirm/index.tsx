import PageWrapper from "@/components/PageWrapper";
import {getQuery, setLoginToken} from "@/utils/utils";
import {useEffect, useState} from "react";
import {confirmJoin, getInviteEmail, getInviteInfo} from "@/api/org";
import cookie from "@/utils/cookie";
import {getUserInfo} from "@/api/profile";
import {get} from "lodash-es";

export default function InviteConfirm() {
  let token = getQuery('token');
  let [errMessage, setErrMessage] = useState('');
  let [orgName, setOrgName] = useState('');

  useEffect(() => {
    if (cookie.getCookie('token')) {
      getUserInfo().then(res => {
        getInviteInfoFun(res.email);
      }).catch(err => {
        cookie.delCookie('token');
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
          cookie.delCookie('token');
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

// http://localhost/invite-confirm?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJoZWlnaGxpbmVyLWNsb3VkLWJhY2tlbmQiLCJleHAiOjE2NTg3MzM1ODUsImlhdCI6MTY1ODEyODc4NSwidXNlcl9pZCI6NSwiZW1haWwiOiIxNTA0NjY0NDMwNEAxNjMuY29tIiwidmVyaWZpY2F0aW9uX3JlY29yZF9pZCI6NCwidmVyaWZpY2F0aW9uX3R5cGUiOiJJbnZpdGF0aW9uIiwidmVyaWZpY2F0aW9uX2NvZGUiOiI5aHhoOG0iLCJidXNpbmVzc19pZCI6Nn0.fU2W-yd9lgsM_OB2ELwzlOn3MrxYeaYkwcxQEksILcE
