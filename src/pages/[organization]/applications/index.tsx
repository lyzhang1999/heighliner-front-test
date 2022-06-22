import React, {useState, useEffect} from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Select,
  MenuItem
} from "@mui/material";
import Layout from "@/components/Layout";
import styles from "./index.module.scss";
import {useRouter} from "next/router";
import {getOrganizationNameByUrl, getOriIdByContext} from "@/utils/utils";
import {ApplicationObject, getApplicationList} from "@/utils/api/application";
import ApplicationList from "@/components/ApplicationList";
import {ClusterItem, getClusterList} from "@/utils/api/cluster";
import {getStacks, Stack} from "@/utils/api/stack";
import {getOrgMembers, GetOrgMembersRes, Member} from "@/utils/api/org";

const Applications = () => {
  const [applist, setApplist] = useState<ApplicationObject[]>([]);
  const [clusterList, setClusterList] = useState<ClusterItem[]>([]);
  const [statckList, setStatckList] = useState<Stack[]>([]);
  const [mumber, setMumber] = useState<Member[]>([]);

  const router = useRouter();

  useEffect(() => {
    getApplicationList().then((res) => {
      setApplist(res.reverse());
    });
    getClusterList().then(res => {
      setClusterList(res);
    })
    getStacks().then(res => {
      setStatckList(res);
    })
    getOrgMembers({org_id: Number(getOriIdByContext()), page: 1, page_size: 999}).then(res => {
      setMumber(res.data);
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

  function handleChange(){

  }

  return (
    <Layout
      pageHeader="Applications"
      // titleContent={
      //   <Button
      //     variant="contained"
      //     onClick={() => {
      //       router.push(
      //         `/${encodeURIComponent(
      //           getOrganizationNameByUrl()
      //         )}/applications/creation`
      //       );
      //     }}
      //     // xs={{backgrounColor: "#1b51b9"}}
      //   >
      //     Create a Application
      //   </Button>
      // }
      rightBtnDesc="ADD APPLICATION"
      rightBtnCb={() => {
        router.push(
          `/${encodeURIComponent(
            getOrganizationNameByUrl()
          )}/applications/creation`
        );
      }}
    >
      <div className={styles.selectWrapper}>
        <Select
          value={"All"}
          onChange={handleChange}
          label="Age"
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
        >
          <MenuItem value="All" key="All">All</MenuItem>
          {
            mumber.map(item => {
              return <MenuItem value={item.username} key={item.username}>{item.username}</MenuItem>
            })
          }
        </Select>
        <Select
          value={"All"}
          onChange={handleChange}
          label="Age"
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
        >
          <MenuItem value="All" key="All">All</MenuItem>

          {
            statckList.map(item => {
              return <MenuItem value={item.name} key={item.name}>{item.name}</MenuItem>
            })
          }
        </Select>
        <Select
          value={"All"}
          onChange={handleChange}
          label="Age"
          variant="standard"
          sx={{ m: 1, minWidth: 120 }}
        >
          <MenuItem value="All" key="All">All</MenuItem>

          {
            clusterList.map(item => {
              return <MenuItem value={item.name} key={item.name}>{item.name}</MenuItem>
            })
          }
        </Select>
      </div>
      <ApplicationList
        list={applist}
        clusterList={clusterList}
      />
    </Layout>
  );
};
export default Applications;
