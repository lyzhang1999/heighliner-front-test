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
import { useEffect, useState } from "react";

import Layout from "@/components/Layout";
import { getOriIdByContext } from "@/utils/utils";

import styles from "./index.module.scss";
import {
  getOrgMembers,
  GetOrgMembersReq,
  GetOrgMembersRes,
} from "@/utils/api/org";
import InviteMember from "@/components/Team/InviteMember";


const Teams = () => {
  const [hasMounted, setHasMounted] = useState(false);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [orgMembers, setOrgMembers] = useState<GetOrgMembersRes>();

  const flushTeams = () => {
    // Fetch the team members
    const getOrgMembersReq: GetOrgMembersReq = {
      org_id: +getOriIdByContext(),
      page: 0,
      page_size: 50,
    };

    getOrgMembers(getOrgMembersReq).then((res) => {
      setOrgMembers(res);
      console.log(res);
    });
  };

  useEffect(() => {
    flushTeams();
  }, []);

  // close server render
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  function pageChange() {}

  return (
    <Layout
      pageHeader="Teams"
      titleContent={
        <Button
          variant="contained"
          onClick={() => {
            setInviteDialog(true);
          }}
        >
          Invite User
        </Button>
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
                <TableCell align="right">{}</TableCell>
              </TableRow>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[10]}
                count={16}
                onPageChange={pageChange}
                page={0}
                rowsPerPage={4}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </div>
      <InviteMember open={inviteDialog} setOpen={setInviteDialog} inviteMemberSuccessCb={flushTeams} />
    </Layout>
  );
};

export default Teams;
