import React from "react";
import { Container, Stack } from "@mui/material";

import Layout from "@/components/Layout";
import SettingSlider from "@/components/Layout/Slider/SettingSlider";
import BasicProfile from "@/components/setting/profile/BasicProfile";
import Password from "@/components/setting/profile/Password";

export default function Setting(): React.ReactElement {
  return (
    <Layout CustomSlider={<SettingSlider />}>
      <Container>
        <Stack spacing={2}>
          <BasicProfile />
          <Password />
        </Stack>
      </Container>
    </Layout>
  );
}
