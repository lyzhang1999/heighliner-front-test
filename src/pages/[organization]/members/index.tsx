import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  MenuItem,
  Select,
} from "@mui/material";
import * as React from "react";
import {ReactNode, useContext, useEffect, useState} from "react";
import clsx from "clsx";

import Layout from "@/components/Layout";
import {formatDate, getOriIdByContext, Message} from "@/utils/utils";
import {
  getOrgMembers,
  GetOrgMembersReq,
  GetOrgMembersRes,
  MemberTypeEnum,
  RoleIcon,
  roleType,
  shiftRole,
  ShiftRoleReq,
} from "@/api/org";
import InviteMember from "@/components/Member/InviteMember";
import {Context} from "@/utils/store";
import {get} from "lodash-es";
import RoleTag from "@/components/RoleTag";
import DeleteUser from "@/components/Member/DeleteUser";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PopSelect from "@/components/PopSelect";

import styles from "./index.module.scss";

enum Action {
  Invite = "Invite",
  Delete = "Delete",
  ShiftRole = "ShiftRole",
}

type ActionSet = Array<keyof typeof Action>;

const pageSize = 10;

const getMenuItemCommonStyle = (roleIcon: string) => {
  return {
    width: '155px',
    color: "#606479",
    fontSize: "15px",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    "&::before": {
      content: `""`,
      display: "block",
      width: "16px",
      height: "16px",
      backgroundImage: `url(${roleIcon})`,
      backgroundSize: "contain",
    },
  };
};

const Members = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [orgMembers, setOrgMembers] = useState<GetOrgMembersRes>();
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteID, setDeleteId] = useState<number>(0);
  const [mountDom, setMountDom] = useState<Element | null>(null);

  function deleteSuccessCb() {
    flushMembers();
  }

  useEffect(() => {
    setMountDom(null);
  }, [deleteModalVisible]);

  const {
    state: {currentOrganization},
  } = useContext(Context);
  const currentMemberType = currentOrganization?.member_type;
  const currentMemberId = currentOrganization?.user_id;

  const flushMembers = () => {
    setInviteDialog(false);
    // Fetch the team members
    const getOrgMembersReq: GetOrgMembersReq = {
      org_id: +getOriIdByContext(),
      page: currentPage + 1,
      page_size: pageSize,
    };

    getOrgMembers(getOrgMembersReq).then((res) => {
      setOrgMembers(res);
    });
  };

  useEffect(() => {
    flushMembers();
  }, []);

  useEffect(() => {
    flushMembers();
  }, [currentPage]);

  // close server render
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  function onPageChange(
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) {
    setCurrentPage(newPage);
  }

  function handleChange(v: ReactNode, user_id: number) {
    let value = get(v, "props.children", "");
    if (!value) {
      return;
    }
    const shiftRoleReq: ShiftRoleReq = {
      user_id: user_id,
      body: {
        member_type: value,
      },
    };

    shiftRole(shiftRoleReq).then(() => {
      Message.success(`change role success`);
      flushMembers();
    });
  }

  return (
    <Layout
      pageHeader="Members"
      rightBtnDesc={
        [roleType.Owner, roleType.Admin].includes(currentMemberType as string)
          ? "invite user"
          : ""
      }
      rightBtnCb={() => {
        setInviteDialog(true);
      }}
    >
      <PopSelect
        {...{
          mountDom,
          setMountDom,
          item: [
            {
              key: "Delete",
              red: true,
              clickCb: () => setDeleteModalVisible(true),
            },
          ],
        }}
      />
      <div>
        <Table
          aria-label="simple table"
          sx={{
            borderCollapse: "separate",
            borderSpacing: "0 14px",
            '.MuiTableCell-root.MuiTableCell-body': {
              fontSize: "15px",
              fontWeight: 500,
              borderBottom: 'none'
            }
          }}
          className={clsx("transparentHeader", styles.table)}
        >
          <TableHead
            sx={{
              "& .MuiTableCell-root.MuiTableCell-head": {
                color: "#606479",

              },
            }}
          >
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Action</TableCell>
              <TableCell align="right">Joined at</TableCell>
              <TableCell align="right">Role</TableCell>
              {/*<TableCell align="right">Status</TableCell>*/}
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orgMembers?.data.map(
              ({user_id, nickname, member_type, created_at}) => (
                <TableRow
                  key={user_id}
                  sx={{"&:last-child td, &:last-child th": {border: 0}}}
                  className={styles.tbodyRow}
                >
                  <TableCell component="th" scope="row">
                    <div className={styles.name}>
                      <img src={RoleIcon[member_type]} alt="user"/>
                      <span>{nickname}</span>
                    </div>
                  </TableCell>
                  <TableCell align="right">
                    {![roleType.Owner].includes(member_type) &&
                    [roleType.Owner, roleType.Admin].includes(
                      currentMemberType as string
                    ) &&
                    currentMemberId !== user_id ? (
                      <Select
                        value={member_type}
                        label=""
                        size="small"
                        variant="standard"
                        sx={{
                          color: "#283547",
                          ".MuiSelect-select": {
                            padding: "4px 10px",
                            fontSize: "14px",
                          },
                          width: "86px",
                          "&::before, :hover:not(.Mui-disabled):before": {
                            borderBottom: "none",
                          },
                          "& .MuiSelect-select.MuiSelect-standard.MuiInput-input.MuiInputBase-input":
                            {
                              backgroundColor: "#f1f3f5",
                              borderRadius: "5px",
                            },
                        }}
                        onChange={(e, v: ReactNode) => handleChange(v, user_id)}
                      >
                        <MenuItem
                          value={MemberTypeEnum.Admin}
                          sx={getMenuItemCommonStyle(RoleIcon[roleType.Owner])}
                        >
                          {MemberTypeEnum.Admin}
                        </MenuItem>
                        <MenuItem
                          value={MemberTypeEnum.Member}
                          sx={getMenuItemCommonStyle(RoleIcon[roleType.Member])}
                        >
                          {MemberTypeEnum.Member}
                        </MenuItem>
                      </Select>
                    ) : (
                      <RoleTag type={member_type}/>
                    )}
                  </TableCell>
                  <TableCell align="right">
                    <div className={styles.time}>
                      {formatDate(created_at * 1000)}
                    </div>
                  </TableCell>
                  <TableCell align="right">{member_type}</TableCell>
                  {/*<TableCell align="right">xxx</TableCell>*/}
                  <TableCell align="right">
                    <div className={styles.moreIcon}>
                      {![roleType.Owner].includes(member_type) &&
                        [roleType.Owner, roleType.Admin].includes(
                          currentMemberType as string
                        ) &&
                        currentMemberId !== user_id && (
                          <MoreVertIcon
                            sx={{cursor: "pointer"}}
                            onClick={(event) => {
                              setDeleteId(user_id);
                              setMountDom(event?.currentTarget);
                            }}
                          />
                        )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            )}
          </TableBody>
          {get(orgMembers, "pagination.total", 0) > 10 && (
            <TableFooter>
              <TableRow
                sx={{"&:last-child td, &:last-child th": {border: 0}}}
              >
                <TablePagination
                  rowsPerPageOptions={[pageSize]}
                  count={
                    orgMembers && orgMembers?.pagination.total > 0
                      ? +orgMembers?.pagination.total
                      : -1
                  }
                  onPageChange={onPageChange}
                  page={currentPage}
                  rowsPerPage={pageSize}
                />
              </TableRow>
            </TableFooter>
          )}
        </Table>
      </div>
      <InviteMember
        open={inviteDialog}
        setOpen={setInviteDialog}
        inviteMemberSuccessCb={flushMembers}
      />
      <DeleteUser
        {...{
          deleteModalVisible,
          deleteSuccessCb,
          setDeleteModalVisible,
          deleteID,
        }}
      />
    </Layout>
  );
};

export default Members;
