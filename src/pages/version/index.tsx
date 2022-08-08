import PageCenter from "@/basicComponents/PageCenter";
import { $$ } from "@/utils/console";
import { formatDate } from "@/utils/utils";
import { Card, CardContent, CardHeader, Typography } from "@mui/material";
import { GetStaticProps } from "next";
import React, { useEffect, useState } from "react";

interface Props {
  buildTime: number;
}

export default function Version(props: Props): React.ReactElement {
  const [buildId, setBuildId] = useState("");

  useEffect(() => {
    const buildId = JSON.parse(
      document.querySelector("#__NEXT_DATA__")!.textContent!
    ).buildId;

    setBuildId(buildId);
  }, []);

  return (
    <PageCenter>
      <Card>
        <CardHeader title="ForkMain Version Information" />
        <CardContent>
          <Typography>Commit Hash: {buildId}</Typography>
          <Typography>Build Time: {formatDate(props.buildTime)}</Typography>
        </CardContent>
      </Card>
    </PageCenter>
  );
}

export const getStaticProps: GetStaticProps<Props> = async (context) => {
  return {
    props: {
      buildTime: Date.now(),
    },
  };
};
