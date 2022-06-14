import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow
} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {NoticeRef} from "@/components/Notice";
import {createOrg, deleteOri, getOrgMembers, GetOrgMembersRes, transferOri} from "@/utils/api/org";
import styles from './index.module.scss';

interface Props {
  transferModalVisible: boolean,
  transferSuccessCb: () => void,
  setTransferModalVisible: (val: boolean) => void,
  transferId: number
}


export const TransferOrganization = (props: Props) => {
  let {transferModalVisible, transferSuccessCb, setTransferModalVisible, transferId} = props;
  const [userList, setUserList] = useState<GetOrgMembersRes>([]);

  useEffect(() => {
    if (transferModalVisible) {
      getOrgMembers({org_id: transferId, page: 1, page_size: 10}).then(res => {
        setUserList(res);
      })
    }

  }, [transferModalVisible])

  const handleClose = () => {
    setTransferModalVisible(false);
  };

  function transferIt(id: number) {
    transferOri({org_id: transferId, new_owner_id: id}).then(res => {
      NoticeRef.current?.open({
        message: "Transfer Success",
        type: "success",
      });
      setTransferModalVisible(false);
      transferSuccessCb();
    })
  }

  return (
    <Dialog
      open={transferModalVisible}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Select a User to Transfer Owner to he/she.
      </DialogTitle>
      <DialogContent id="alert-dialog-title" className={styles.transferTable}>
        <Table aria-label="simple table">
          {/*<TableHead>*/}
          {/*  <TableRow>*/}
          {/*    <TableCell>Dessert (100g serving)</TableCell>*/}
          {/*    <TableCell align="right">Calories</TableCell>*/}
          {/*    <TableCell align="right">Fat&nbsp;(g)</TableCell>*/}
          {/*    <TableCell align="right">Carbs&nbsp;(g)</TableCell>*/}
          {/*    <TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
          {/*  </TableRow>*/}
          {/*</TableHead>*/}
          <TableBody>
            {userList.map((row) => (
              <TableRow
                key={row.id}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {row.username}
                </TableCell>
                <TableCell align="right">
                  <Button onClick={() => transferIt(row.user_id)}>
                    Transfer
                  </Button>
                  {/*{row.calories}*/}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      {/*<DialogActions>*/}
      {/*  <Button onClick={handleClose}>Cancel</Button>*/}
      {/*  <Button onClick={deleteIt} variant="contained"*/}
      {/*          color="error"*/}
      {/*  >*/}
      {/*    Delete*/}
      {/*  </Button>*/}
      {/*</DialogActions>*/}
    </Dialog>
  )
}
