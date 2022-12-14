import React from "react";
import { Stack, Typography } from "@mui/material";

import Layout from "@/components/Layout";
import BasicProfile from "@/components/setting/profile/BasicProfile";
import Password from "@/components/setting/profile/Password";
import Email from "@/components/setting/profile/Email";
import Logout from "@/components/setting/profile/Logout";

import styles from "./index.module.scss";

export default function Setting(): React.ReactElement {
  return (
    <Layout notStandardLayout={true}
    >
      <div className={styles.wrapper}>
        <div className={styles.container}>
          <Typography variant="h1">My Profile</Typography>
          <Stack spacing={2} style={{marginTop: '25px'}}>
            <div className={styles.card}>
              <BasicProfile />
            </div>
            <div className={styles.card}>
             <Email />
            </div>
            <div className={styles.card}>
              <Password />
            </div>
            <div className={styles.card}>
              <Logout />
            </div>
          </Stack>
        </div>
      </div>
    </Layout>
  );
}
