import Layout from "@/components/Layout";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import {Button} from "@mui/material";
import {CreateOriganization} from "@/pages/organizations/createOriganization";
import {DeleteOrganization} from "@/pages/organizations/deleteOrganization";
import styles from './index.module.scss';
import {useContext, useState} from "react";
import * as React from "react";
import {Context} from "@/utils/store";
import {useRouter} from "next/router";
import {getOrgList, leaveOriApi, OrgList, roleType} from "@/utils/api/org";
import {formatDate} from "@/utils/utils";

function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return {name, calories, fat, carbs, protein};
}

const Organizations = () => {

  const {state, dispatch} = useContext(Context);
  let {organizationList} = state;

  const [open, setOpen] = React.useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState<boolean>(false);
  const [deleteID, setDeleteId] = useState<number>(0);

  function successCb() {
    updateOriList();
  }

  function deleteCb() {
    updateOriList();
  }

  function updateOriList() {
    getOrgList().then(res => {
      dispatch({organizationList: res})
    })
  }

  function leaveOri(org_id: number) {
    leaveOriApi({org_id}).then(res => {
      updateOriList();
    })
  }

  return (
    <Layout hiddenContent>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.left}>
            <div className={styles.title}>
              Hey Devloper!
            </div>
            <div className={styles.desc}>
              Here’s the list of your organizations
            </div>
          </div>
          <div className={styles.right} onClick={() => {
            setOpen(true)
          }}>
            Create Organization
          </div>
        </div>
      </div>
      <div className={styles.tableWrapper}>
        <Table sx={{}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Created Time</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(organizationList as OrgList[]).map((row) => (
              <TableRow
                key={row.name}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{formatDate(row.created_at)}</TableCell>
                <TableCell align="right">{roleType[row.member.member_type]}</TableCell>

                <TableCell align="right">
                  {
                    [1].includes(row.member.member_type) &&
                    <div className={styles.actionWrapper}>
                      <Button
                        sx={{cursor: 'pointer'}}
                        onClick={() => {
                          setDeleteId(row.id);
                          setDeleteModalVisible(true);
                        }}
                      >
                        Delete
                      </Button>
                      <Button
                        sx={{cursor: 'pointer'}}
                        onClick={() => {
                          // setDeleteId(row.id);
                          // setDeleteModalVisible(true);
                        }}
                      >
                        Transfer
                      </Button>
                    </div>
                  }
                  {
                    [3, 2].includes(row.member.member_type) &&
                    <Button
                      sx={{cursor: 'pointer'}}
                      onClick={() => leaveOri(row.id, row.member.user_id)}
                    >
                      Leave
                    </Button>
                  }
                </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <CreateOriganization
        {...{
          open,
          setOpen,
          successCb
        }}
      />
      <DeleteOrganization
        {...{
          deleteModalVisible,
          deleteCb,
          setDeleteModalVisible,
          deleteID
        }}
      />

    </Layout>
  )
}

export default Organizations;
// http://localhost/organizations
