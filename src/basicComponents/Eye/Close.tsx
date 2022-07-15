import Image from "next/image";
import React from "react";

export default function EyeClose(): React.ReactElement {
  return (
    <div
      style={{
        position: "relative",
        height: "18px",
        width: "18px",
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
