import { useState } from "react";

export default function usePasswordEye(): [
  boolean,
  () => void,
  "text" | "password"
] {
  const [eyeStatus, setEyeStatus] = useState(false);
  const [type, setType] = useState<"text" | "password">("password");

  return [
    eyeStatus,
    function reverseEyeStatus() {
      const reverseEyeStatus = !eyeStatus;
      setEyeStatus(reverseEyeStatus);
      switch (reverseEyeStatus) {
        case true:
          setType("text");
          break;
        case false:
          setType("password");
          break;
      }
    },
    type,
  ];
}
