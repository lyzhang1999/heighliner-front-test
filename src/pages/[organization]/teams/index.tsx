import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import * as React from "react";
import { useContext, useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { getOriIdByContext } from "@/utils/utils";

import styles from "./index.module.scss";
import {
  getOrgMembers,
  GetOrgMembersReq,
  GetOrgMembersRes,
  MemberType,
  MemberTypeEnum,
} from "@/utils/api/org";
import InviteMember from "@/components/Team/InviteMember";
import { Context } from "@/utils/store";
import ShiftRole from "@/components/Team/ShiftRole";
import DeleteMember from "@/components/Team/DeleteMember";

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

  const {
    state: { currentOrganization },
  } = useContext(Context);
  const currentMemberType = currentOrganization?.member_type;

  const flushTeams = () => {
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

  return (
    <Layout
      pageHeader="Teams"
      titleContent={
        <>
          {getActionSet(currentMemberType!).includes(Action.Invite) && (
            <Button
              variant="contained"
              onClick={() => {
                setInviteDialog(true);
              }}
            >
              Invite User
            </Button>
          )}
        </>
      }
    >
      <div className={styles.teamsWrapper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>UserName</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {orgMembers?.data.map(({ user_id, username, member_type }) => (
              <TableRow
                key={user_id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row">
                  {username}
                </TableCell>
                <TableCell align="right">{member_type}</TableCell>
                <TableCell align="right">
                  {getActionSet(currentMemberType!, member_type).map(
                    (action) => {
                      switch (action) {
                        case Action.ShiftRole:
                          return (
                            <ShiftRole
                              currentMemberType={member_type}
                              username={username}
                              userId={user_id}
                              orgId={+getOriIdByContext()}
                              successCallback={flushTeams}
                            />
                          );
                        case Action.Delete:
                          return (
                            <DeleteMember
                              userId={user_id}
                              orgId={+getOriIdByContext()}
                              username={username}
                              successCallback={flushTeams}
                            />
                          );
                      }
                    }
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
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
        </Table>
      </div>
      <InviteMember
        open={inviteDialog}
        setOpen={setInviteDialog}
        inviteMemberSuccessCb={flushTeams}
      />
    </Layout>
  );
};

export default Teams;
