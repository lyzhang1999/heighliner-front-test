import { height } from "@mui/system";
import Image from "next/image";
import React from "react";

export default function EyeOpen(): React.ReactElement {
  return (
    <div
      style={{
        position: "relative",
        height: "20px",
        width: "20px",
      }}
    >
      <Image
        src="/img/eye/open@3x.png"
        layout="fill"
        objectFit="contain"
        alt=""
      />
    </div>
  );
}
