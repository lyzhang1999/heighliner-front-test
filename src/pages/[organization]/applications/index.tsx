import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Layout from "@/components/Layout";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { getOrganizationNameByUrl } from "@/utils/utils";
import { ApplicationObject, getApplicationList } from "@/utils/api/application";
import ApplicationList from "@/components/ApplicationList";
import {ClusterItem, getClusterList} from "@/utils/api/cluster";

const Applications = () => {
  const [applist, setApplist] = useState<ApplicationObject[]>([]);
  const [clusterList, setClusterList] = useState<ClusterItem[]>([]);

  const router = useRouter();

  useEffect(() => {
    getApplicationList().then((res) => {
      setApplist(res.data.reverse());
    });
    getClusterList().then(res => {
      setClusterList(res.data);
    })
  }, []);

  function goPanel(appId: number, releaseId: number) {
    const queryParameters = new URLSearchParams({
      app_id: appId.toString(),
      release_id: releaseId.toString(),
    });
    router.push(
      `/${getOrganizationNameByUrl()}/applications/panel?${queryParameters.toString()}`
    );
  }

  return (
    <Layout
      pageHeader="APPLICATIONS"
      titleContent={
        <Button
          variant="contained"
          onClick={() => {
            router.push(
              `/${encodeURIComponent(
                getOrganizationNameByUrl()
              )}/applications/creation`
            );
          }}
        >
          Create a Application
        </Button>
      }
    >
      <ApplicationList
        list={applist}
        clusterList={clusterList}
      />
    </Layout>
  );
};
export default Applications;
