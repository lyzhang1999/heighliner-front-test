import PageWrapper from "@/components/PageWrapper";
import {useRouter} from "next/router";

export default function SignupSuccess() {
  const router = useRouter();

  function validateCb() {
    location.pathname = "/sign-in";
  }

  return (
    <PageWrapper
      title="Sign up success"
      desc="Please go email to validate account."
      btnDesc={"Validated, Go Login"}
      btnCb={validateCb}
    >
    </PageWrapper>
  )
}
