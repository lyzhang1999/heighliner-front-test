import Layout from "@/components/Layout";
import {TableRow, TableHead, TableCell, TableBody, Table, Tooltip, Button} from "@mui/material";
import CreateOrganization from "@/pages/organizations/createOrganization";
import DeleteOrganization from "@/pages/organizations/deleteOrganization";
import TransferOrganization from "@/pages/organizations/transferOrganization";
import LeaveOrganization from "@/pages/organizations/leaveOrganization";
import styles from './index.module.scss';
import {useContext, useEffect, useState} from "react";
import * as React from "react";
import {Context} from "@/utils/store";
import {getOrgList, OrgList, RoleIcon, roleType} from "@/api/org";
import {formatDate, getCurrentOrg, getDefaultOrg, getQuery, Message} from "@/utils/utils";
import {get} from "lodash-es";
import {useRouter} from "next/router";
import RoleTag from "@/components/RoleTag";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PopSelect, {PopItem} from "@/components/PopSelect";
import { changeDefaultOrg } from "@/api/profile";
import useDefaultOrg from "@/hooks/defaultOrg";

const Organizations = () => {
  const {state, dispatch} = useContext(Context);
  let {organizationList, currentOrganization} = state;

  const [open, setOpen] = React.useState<boolean>(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteID, setDeleteId] = useState<number>(0);
  const [transferModalVisible, setTransferModalVisible] = useState<boolean>(false);
  const [transferId, setTransferId] = useState<number>(0);
  const [leaveModalVisible, setLeaveModalVisible] = useState<boolean>(false);
  const [leaveId, setLeaveId] = useState<number>(0);
  const [currentDefaultOrgId, flushCurrentDefaultOrgId] = useDefaultOrg();
  const [chosenDefaultOrgId, setChosenDefaultOrgId] = useState<number>();
  const [activeType, setActiveType] = React.useState<{
    roleType: keyof typeof roleType,
    isDefault: boolean
  }>();
  const [mountDom, setMountDom] = useState<Element | null>(null);

  useEffect(() => {
    setMountDom(null);
  }, [deleteModalVisible, leaveModalVisible, transferModalVisible])

  const router = useRouter();
  useEffect(() => {
    if (getQuery('new')) {
      setOpen(true);
    }
  }, [router])

  function createSuccessCb() {
    updateOriList();
  }

  function deleteSuccessCb() {
    updateOriList();
    checkOrg(deleteID);
  }

  function transferSuccessCb() {
    updateOriList();
  }

  function leaveModalCb() {
    updateOriList();
    checkOrg(leaveId);
  }

  // Judge is current organization, change to default organization
  function checkOrg(id: number) {
    if (get(currentOrganization, 'org_id') === id) {
      let defaultItem = getDefaultOrg(organizationList);
      if (defaultItem) {
        dispatch({currentOrganization: getCurrentOrg(defaultItem)})
      }
    }
  }

  function updateOriList() {
    getOrgList().then(res => {
      dispatch({organizationList: res.data})
    })
  }
  
  function setDefaultOrg() {
    if(currentDefaultOrgId !== chosenDefaultOrgId) {
      changeDefaultOrg(chosenDefaultOrgId!).then(res => {
        flushCurrentDefaultOrgId(res.default_org_id)
      });
    } else {
      Message.warning("The current organization is already the default.");
    }
    
    setMountDom(null);
    return;
  }

  function getPopItem(): PopItem[] {
    let item: PopItem[] = [];
    if(!activeType?.isDefault) {
      if ([roleType.Owner].includes(activeType?.roleType || "")) {
        item.push({
          key: "Delete",
          red: true,
          clickCb: () => setDeleteModalVisible(true)
        }, {
          key: "Transfer",
          clickCb: () => setTransferModalVisible(true)
        })
      } else if ([roleType.Admin, roleType.Member].includes(activeType?.roleType || "")) {
        item.push({
          key: "Leave",
          clickCb: () => setLeaveModalVisible(true)
        })
      }
    }
    // No role limit
    item.push({
      key: "Set As Default",
      clickCb: setDefaultOrg
    })
    return item;
  }

  return (
    <Layout
      pageHeader="Organizations"
      rightBtnDesc="new organization"
      rightBtnCb={() => setOpen(true)}
    >
      <PopSelect
        {...{
          mountDom,
          setMountDom,
          item: getPopItem()
        }}
      />
      <div className={styles.tableWrapper}>
        <Table className="transparentHeader">
          <TableHead>
            <TableRow>
              <TableCell>ORGANIZATION NAME</TableCell>
              <TableCell align="right">CREATE TIME</TableCell>
              <TableCell align="right">ROLE</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(organizationList as OrgList[]).map((row) => {
              let member_type = get(row, ['member', 'member_type']);
              return (
                <TableRow
                  key={row.name}
                >
                  <TableCell component="th" scope="row">
                    <div className={styles.name}>
                      <img src={RoleIcon[member_type]} alt="user"/>
                      <span>
                        {row.name}
                        {
                          row.id === currentDefaultOrgId && (
                            <span>
                              <div className={styles.defaultOrg}>Default</div>
                            </span>
                        )}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    <div className={styles.time}> {formatDate(row.created_at * 1000)}</div>
                  </TableCell>
                  <TableCell align="right">
                    <RoleTag type={member_type}/>
                  </TableCell>
                  <TableCell align="right">
                    <div className={styles.moreIcon}>
                      {
                        [roleType.Owner].includes(member_type) && row.type === 'Default' ?
                          // <Tooltip
                          //   title="Init organization does not allow operations"
                          //   placement="left"
                          // >
                          //   <MoreVertIcon color="disabled" sx={{cursor: "pointer"}}/>
                          // </Tooltip>
                          <MoreVertIcon sx={{cursor: "pointer"}} onClick={(event) => {
                            setChosenDefaultOrgId(row.id);
                            setActiveType({roleType: member_type, isDefault: true});
                            setMountDom(event?.currentTarget);
                          }}/>
                          :
                          <MoreVertIcon sx={{cursor: "pointer"}} onClick={(event) => {
                            setDeleteId(row.id);
                            setTransferId(row.id);
                            setLeaveId(row.id);
                            setChosenDefaultOrgId(row.id);
                            setActiveType({roleType: member_type, isDefault: false});
                            setMountDom(event?.currentTarget);
                          }}/>
                      }
                    </div>

                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <CreateOrganization
        {...{
          open,
          setOpen,
          successCb: createSuccessCb
        }}
      />
      <DeleteOrganization
        {...{
          deleteModalVisible,
          deleteSuccessCb,
          setDeleteModalVisible,
          deleteID
        }}
      />
      <TransferOrganization
        {...{
          transferModalVisible,
          setTransferModalVisible,
          transferSuccessCb,
          transferId
        }}
      />
      <LeaveOrganization
        {...{
          leaveModalVisible,
          leaveModalCb,
          setLeaveModalVisible,
          leaveId
        }}
      />
    </Layout>
  )
}

export default Organizations;
// http://localhost/organizations
