import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow, MenuItem, Select
} from "@mui/material";
import * as React from "react";
import {ReactNode, useContext, useEffect, useState} from "react";

import Layout from "@/components/Layout";
import {formatDate, getOriIdByContext, Message} from "@/utils/utils";

import styles from "./index.module.scss";
import {
  getOrgMembers,
  GetOrgMembersReq,
  GetOrgMembersRes,
  MemberType,
  MemberTypeEnum, roleType, shiftRole, ShiftRoleReq,
} from "@/utils/api/org";
import InviteMember from "@/components/Team/InviteMember";
import {Context} from "@/utils/store";
import {get, orderBy} from "lodash-es";
import RoleTag from "@/components/RoleTag";
import DeleteUser from "@/components/Team/DeleteUser"
import MoreVertIcon from "@mui/icons-material/MoreVert";
import PopSelect from "@/components/PopSelect";

enum Action {
  Invite = "Invite",
  Delete = "Delete",
  ShiftRole = "ShiftRole",
}

type ActionSet = Array<keyof typeof Action>;

const pageSize = 10;

function getActionSet(
  currentMemberType: MemberType,
  comparedMemberType?: MemberType
): ActionSet {
  switch (true) {
    // Check only current member type.
    case comparedMemberType === undefined:
      switch (true) {
        // Owner has all actions.
        case currentMemberType === MemberTypeEnum.Owner:
          return [Action.Invite, Action.Delete, Action.ShiftRole];
        // Admin have invite by default.
        case currentMemberType === MemberTypeEnum.Admin:
          return [Action.Invite];
        // Member didn't any actions.
        case currentMemberType === MemberTypeEnum.Member:
          return [];
      }
    // Compare with other memberType
    case comparedMemberType !== undefined:
      switch (true) {
        case currentMemberType === MemberTypeEnum.Owner:
          switch (true) {
            case comparedMemberType === MemberTypeEnum.Owner:
              return [Action.Invite];
            case comparedMemberType === MemberTypeEnum.Admin:
              return [Action.Invite, Action.Delete, Action.ShiftRole];
            case comparedMemberType === MemberTypeEnum.Member:
              return [Action.Invite, Action.Delete, Action.ShiftRole];
          }
        case currentMemberType === MemberTypeEnum.Admin:
          switch (true) {
            case comparedMemberType === MemberTypeEnum.Owner:
              return [Action.Invite];
            case comparedMemberType === MemberTypeEnum.Admin:
              return [Action.Invite];
            case comparedMemberType === MemberTypeEnum.Member:
              return [Action.Invite, Action.Delete];
          }
        case currentMemberType === MemberTypeEnum.Member:
          switch (true) {
            case comparedMemberType === MemberTypeEnum.Owner:
              return [];
            case comparedMemberType === MemberTypeEnum.Admin:
              return [];
            case comparedMemberType === MemberTypeEnum.Member:
              return [];
          }
      }
    default:
      return [];
  }
}

const Teams = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [orgMembers, setOrgMembers] = useState<GetOrgMembersRes>();
  const [currentPage, setCurrentPage] = useState(0);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteID, setDeleteId] = useState<number>(0);
  let PopRef = React.useRef<React.MutableRefObject<null>>(null);

  function deleteSuccessCb() {
    flushTeams();
  }

  const {
    state: {currentOrganization},
  } = useContext(Context);
  const currentMemberType = currentOrganization?.member_type;
  const currentMemberId = currentOrganization?.user_id;

  const flushTeams = () => {
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
    flushTeams();
  }, []);

  useEffect(() => {
    flushTeams();
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
    let value = get(v, 'props.children', '');
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
      Message.success(`change role success`)
      flushTeams();
    });
  }

  return (
    <Layout
      pageHeader="Teams"
      rightBtnDesc={([roleType.Owner, roleType.Admin].includes(currentMemberType as string)) ? "invite user" : ''}
      rightBtnCb={() => {
        setInviteDialog(true);
      }}
    >
      <PopSelect
        ref={PopRef}
        item={[{
          key: "Delete",
          red: true,
          clickCb: () => setDeleteModalVisible(true)
        }]}
      />
      <div className={styles.teamsWrapper}>
        <Table aria-label="simple table" className="transparentHeader">
          <TableHead
            sx={{"& .tr": {backgroundColor: "rgba(0,0,0,0);"}}}
          >
            <TableRow>
              <TableCell>USERNAME</TableCell>
              <TableCell align="right">JOINT AT</TableCell>
              <TableCell align="right">ROLE</TableCell>
              <TableCell align="right"></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orgMembers?.data.map(({user_id, username, member_type, created_at}) => (
              <TableRow
                key={user_id}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {username}
                </TableCell>
                <TableCell align="right">
                  <div className={styles.time}>{formatDate(created_at * 1000)}</div>
                </TableCell>
                <TableCell align="right">
                  {
                    (![roleType.Owner].includes(member_type) &&
                      [roleType.Owner, roleType.Admin].includes(currentMemberType as string) &&
                      (currentMemberId !== user_id)) ?
                      <Select
                        value={member_type}
                        label=""
                        size="small"
                        variant="standard"
                        sx={{".MuiSelect-select": {padding: "4px 10px", fontSize: '14px'}, width: '86px'}}
                        onChange={(e, v: ReactNode) => handleChange(v, user_id)}
                      >
                        <MenuItem value={MemberTypeEnum.Member}>{MemberTypeEnum.Member}</MenuItem>
                        <MenuItem value={MemberTypeEnum.Admin}>{MemberTypeEnum.Admin}</MenuItem>
                      </Select>
                      :
                      <RoleTag type={member_type}/>
                  }
                </TableCell>
                <TableCell align="right">

                  {/*{getActionSet(currentMemberType!, member_type).map(*/}
                  {/*  (action, index) => {*/}
                  {/*    switch (action) {*/}
                  {/*      case Action.ShiftRole:*/}
                  {/*        return (*/}
                  {/*          <ShiftRole*/}
                  {/*            key={index}*/}
                  {/*            currentMemberType={member_type}*/}
                  {/*            username={username}*/}
                  {/*            userId={user_id}*/}
                  {/*            orgId={+getOriIdByContext()}*/}
                  {/*            successCallback={flushTeams}*/}
                  {/*          />*/}
                  {/*        );*/}
                  {/*      case Action.Delete:*/}
                  {/*        return (*/}
                  {/*          <DeleteMember*/}
                  {/*            key={index}*/}
                  {/*            userId={user_id}*/}
                  {/*            orgId={+getOriIdByContext()}*/}
                  {/*            username={username}*/}
                  {/*            successCallback={flushTeams}*/}
                  {/*          />*/}
                  {/*        );*/}
                  {/*    }*/}
                  {/*  }*/}
                  {/*)}*/}
                  {
                    ![roleType.Owner].includes(member_type) &&
                    [roleType.Owner, roleType.Admin].includes(currentMemberType as string) &&
                    (currentMemberId !== user_id) &&
                    <MoreVertIcon sx={{cursor: "pointer"}} onClick={(event) => {
                      setDeleteId(user_id);
                      // setActiveType(member_type);
                      // @ts-ignore
                      PopRef?.current?.setSelect(event?.currentTarget)
                    }}/>
                  }
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          {
            (get(orgMembers, 'pagination.total', 0) > 10) &&
            <TableFooter>
              <TableRow
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
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
          }
        </Table>
      </div>
      <InviteMember
        open={inviteDialog}
        setOpen={setInviteDialog}
        inviteMemberSuccessCb={flushTeams}
      />
      <DeleteUser
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

export default Teams;
