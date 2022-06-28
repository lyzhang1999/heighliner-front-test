import React, {useState, useEffect, ReactNode} from "react";
import {Select, MenuItem, InputLabel, FormControl, FormHelperText} from "@mui/material";
import Layout from "@/components/Layout";
import styles from "./index.module.scss";
import {useRouter} from "next/router";
import {getOrganizationNameByUrl, getOriIdByContext, uuid} from "@/utils/utils";
import {ApplicationObject, getApplicationList, getAppListReq} from "@/utils/api/application";
import ApplicationList from "@/components/ApplicationList";
import {ClusterItem, getClusterList} from "@/utils/api/cluster";
import {getStacks, Stack} from "@/utils/api/stack";
import {getOrgMembers, Member} from "@/utils/api/org";
import {get} from "lodash-es";
import DeleteApplication from "@/components/DeleteApplication";

const AllKey = "THEDEFAULTALLKEY" + uuid();

const Applications = () => {
  const [applist, setApplist] = useState<ApplicationObject[]>([]);
  const [clusterList, setClusterList] = useState<ClusterItem[]>([]);
  const [statckList, setStatckList] = useState<Stack[]>([]);
  const [mumber, setMumber] = useState<Member[]>([]);
  const [selectRule, setSelectRule] = useState<getAppListReq>({
    cluster_ids: [],
    owner_ids: [],
    stack_ids: []
  })

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteID, setDeleteID] = useState<number>(-1);

  const router = useRouter();

  useEffect(() => {
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

  useEffect(() => {
    getApplicationList(selectRule).then((res) => {
      setApplist(res);
    });
  }, [selectRule])

  function deleteSuccessCb() {
    getApplicationList(selectRule).then((res) => {
      setApplist(res);
    });
  }

  function goPanel(appId: number, releaseId: number) {
    const queryParameters = new URLSearchParams({
      app_id: appId.toString(),
      release_id: releaseId.toString(),
    });
    router.push(
      `/${getOrganizationNameByUrl()}/applications/panel?${queryParameters.toString()}`
    );
  }

  function handleChange(a: ReactNode, key: string) {
    let val = get(a, 'props.value');
    let currentVal = get(selectRule, [key, 0]);
    if (currentVal === val) {
      return;
    }
    if (val === AllKey) {
      setSelectRule({
        ...selectRule,
        [key]: []
      })
    } else {
      setSelectRule({
        ...selectRule,
        [key]: [val]
      })
    }
  }

  return (
    <Layout
      pageHeader="Applications"
      rightBtnDesc="ADD APPLICATION"
      rightBtnCb={() => {
        router.push(
          `/${encodeURIComponent(
            getOrganizationNameByUrl()
          )}/applications/creation`
        );
      }}
      notStandardLayout
    >
      <div className={styles.pageWrapper}>
        <div className={styles.selectWrapper}>
          <div className={styles.selectItemBox}>
            <div className={styles.lable}>Owner:</div>
            <Select
              value={get(selectRule, 'owner_ids.0') || AllKey}
              onChange={(e, v) => handleChange(v, 'owner_ids')}
              label="Owner"
              variant="standard"
              sx={{m: 1, minWidth: 120}}
            >
              <MenuItem value={AllKey} key={AllKey}>All</MenuItem>
              {
                mumber.map(item => {
                  return <MenuItem value={item.user_id} key={item.user_id}>{item.username}</MenuItem>
                })
              }
            </Select>
          </div>
          <div className={styles.selectItemBox}>
            <div className={styles.lable}>Stack:</div>
            <Select
              value={get(selectRule, 'stack_ids.0') || AllKey}
              onChange={(e, v) => handleChange(v, 'stack_ids')}
              label=""
              variant="standard"
              sx={{m: 1, minWidth: 120}}
            >
              <MenuItem value={AllKey} key={AllKey}>All</MenuItem>
              {
                statckList.map(item => {
                  return <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                })
              }
            </Select>
          </div>
          <div className={styles.selectItemBox}>
            <div className={styles.lable}>Cluster:</div>
            <Select
              value={get(selectRule, 'cluster_ids.0') || AllKey}
              onChange={(e, v) => handleChange(v, 'cluster_ids')}
              label=''
              variant="standard"
              sx={{m: 1, minWidth: 120}}
            >
              <MenuItem value={AllKey} key={AllKey}>All</MenuItem>
              {
                clusterList.map(item => {
                  return <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                })
              }
            </Select>
          </div>
        </div>
        <ApplicationList
          list={applist}
          clusterList={clusterList}
          setDeleteID={setDeleteID}
          setDeleteModalVisible={setDeleteModalVisible}
        />
      </div>
      <DeleteApplication
        {...{
          deleteModalVisible,
          deleteSuccessCb,
          setDeleteModalVisible,
          deleteID
        }}
      />
    </Layout>
  );
};
export default Applications;
