import PageWrapper from "@/components/PageWrapper";

export default function SignupSuccess() {

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
