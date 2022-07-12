import Image from "next/image";
import React from "react";

export default function EyeClose(): React.ReactElement {
  return (
    <div
      style={{
        position: "relative",
        height: "24px",
        width: "24px",
      }}
    >
      <Image
        src="/img/eye/close@3x.png"
        layout="fill"
        objectFit="contain"
        alt=""
      />
    </div>
  );
}
