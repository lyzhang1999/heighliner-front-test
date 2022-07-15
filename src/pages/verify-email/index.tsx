import PageWrapper from "@/components/PageWrapper";
import {getQuery, setLoginToken} from "@/utils/utils";
import {useEffect, useState} from "react";
import {checkEmail} from "@/api/login";

export default function VerifyEmail() {
  const [render, setRender] = useState<boolean>(false);

  useEffect(() => {
    confirm()
  }, [])

  function confirm() {
    let urlToken = getQuery("token");
    checkEmail(urlToken).then(res => {
      setLoginToken(res.token);
      location.pathname = '/';
    }).catch(err => {
      setRender(true);
    })
  }

  if (!render) {
    return null;
  }

  return (
    <PageWrapper
      title="Authentication Failed"
      desc="It looks like you may have clicked on an invalid email verification link, Please close this window and try authenticating again."
      // btnDesc={"Yes I`m sure"}
      // btnCb={confirm}
    >
    </PageWrapper>
  )
}
