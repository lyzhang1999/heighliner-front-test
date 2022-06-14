import Layout from "@/components/Layout";
import {Button, TableRow, TableHead, TableCell, TableBody, Table} from "@mui/material";
import CreateOrganization from "@/pages/organizations/createOrganization";
import DeleteOrganization from "@/pages/organizations/deleteOrganization";
import TransferOrganization from "@/pages/organizations/transferOrganization";
import styles from './index.module.scss';
import {useContext, useState} from "react";
import * as React from "react";
import {Context} from "@/utils/store";
import {getOrgList, leaveOriApi, OrgList, roleType} from "@/utils/api/org";
import {formatDate} from "@/utils/utils";
import {get} from "lodash-es";

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
  const [transferModalVisible, setTransferModalVisible] = useState<boolean>(false);
  const [transferId, setTransferId] = useState<number>(0);


  function successCb() {
    updateOriList();
  }

  function deleteSuccessCb() {
    updateOriList();
  }

  function transferSuccessCb() {
    updateOriList();
  }

  function updateOriList() {
    getOrgList().then(res => {
      dispatch({organizationList: res.data})
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
              <TableCell align="right">Created Time </TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {(organizationList as OrgList[]).map((row) => {
              let member_type = get(row, ['member', 'member_type']);
              return (
                <TableRow
                  key={row.name}
                  sx={{'&:last-child td, &:last-child th': {border: 0}}}
                >
                  <TableCell component="th" scope="row">
                    {row.name}
                  </TableCell>
                  <TableCell align="right">{formatDate(row.created_at)}</TableCell>
                  <TableCell align="right">{member_type}</TableCell>

                  <TableCell align="right">
                    {
                      [roleType.Owner].includes(member_type) && row.type !== 'Default' &&
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
                            setTransferModalVisible(true);
                            setTransferId(row.id)
                          }}
                        >
                          Transfer
                        </Button>
                      </div>
                    }
                    {
                      [roleType.Admin, roleType.Number].includes(member_type) &&
                      <Button
                        sx={{cursor: 'pointer'}}
                        onClick={() => leaveOri(row.id)}
                      >
                        Leave
                      </Button>
                    }
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
          successCb
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

    </Layout>
  )
}

export default Organizations;
// http://localhost/organizations
