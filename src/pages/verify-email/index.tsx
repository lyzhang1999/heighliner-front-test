import PageWrapper from "@/components/PageWrapper";
import {getQuery, setLoginToken} from "@/utils/utils";
import {useEffect} from "react";
import cookie from "@/utils/cookie";
import {checkEmail} from "@/api/login";

export default function VerifyEmail() {

  function confirm() {
    let urlToken = getQuery("token");
    checkEmail(urlToken).then(res => {
      setLoginToken(res.token);
      location.pathname = '/';
    }).catch(err => {
    })
  }

  return (
    <PageWrapper
      title="Join Fork Main"
      desc="Are you sure to sign up forkmain."
      btnDesc={"Yes I`m sure"}
      btnCb={confirm}
    >
    </PageWrapper>
  )
}
