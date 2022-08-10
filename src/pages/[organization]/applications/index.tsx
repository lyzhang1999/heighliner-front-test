import React, {useState, useEffect, ReactNode} from "react";
import {Select, MenuItem} from "@mui/material";
import Layout from "@/components/Layout";
import styles from "./index.module.scss";
import {useRouter} from "next/router";
import {getOriIdByContext, getUrlEncodeName, uuid} from "@/utils/utils";
import {ApplicationObject, ApplicationStatus, getApplicationList, getAppListReq} from "@/api/application";
import ApplicationList from "@/components/ApplicationList";
import {ClusterItem, getClusterList} from "@/api/cluster";
import {getStacks, Stack} from "@/api/stack";
import {getOrgMembers, Member} from "@/api/org";
import {find, get} from "lodash-es";
import DeleteApplication from "@/components/DeleteApplication";

const AllKey = "THEDEFAULTALLKEY" + uuid();

const Applications = () => {
  const [appList, setAppList] = useState<ApplicationObject[] | null>(null);
  const [clusterList, setClusterList] = useState<ClusterItem[]>([]);
  // const [stackList, setStackList] = useState<Stack[]>([]);
  const [member, setMember] = useState<Member[]>([]);
  const [selectRule, setSelectRule] = useState<getAppListReq>({
    cluster_ids: [],
    owner_ids: [],
    stack_ids: []
  })

  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteID, setDeleteID] = useState<number>(-1);
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(null);

  const router = useRouter();

  useEffect(() => {
    getClusterList().then(res => {
      setClusterList(res);
    })
    // getStacks().then(res => {
    //   setStackList(res);
    // })
    getOrgMembers({org_id: Number(getOriIdByContext()), page: 1, page_size: 999}).then(res => {
      setMember(res.data);
    })
  }, []);

  useEffect(() => {
    let hasProcessingApp = find(appList, {last_release: {status: ApplicationStatus.PROCESSING}});
    let timer: ReturnType<typeof setTimeout>;
    if (hasProcessingApp) {
      timer = setTimeout(() => {
        getList();
      }, 1000 * 60);
    }
    return () => clearTimeout(timer);
  }, [appList])

  useEffect(() => {
    getList()
  }, [selectRule])

  function deleteSuccessCb() {
    setAnchorEl(null)
    getList();
  }

  function getList() {
    getApplicationList(selectRule).then((res) => {
      setAppList(res);
    });
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
      rightBtnDesc="add application"
      rightBtnCb={() => {
        router.push(
          `/${getUrlEncodeName()}/applications/creation`
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
                member.map(item => {
                  return <MenuItem value={item.user_id} key={item.user_id}>{item.nickname}</MenuItem>
                })
              }
            </Select>
          </div>
          {/* <div className={styles.selectItemBox}>
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
                stackList.map(item => {
                  return <MenuItem value={item.id} key={item.id}>{item.name}</MenuItem>
                })
              }
            </Select>
          </div> */}
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
          {...{
            list: appList,
            clusterList,
            setDeleteID,
            setDeleteModalVisible,
            anchorEl,
            setAnchorEl
          }}
        />
      </div>
      <DeleteApplication
        {...{
          deleteModalVisible,
          deleteSuccessCb,
          setDeleteModalVisible,
          deleteID,
          setAnchorEl
        }}
      />
    </Layout>
  );
};
export default Applications;
