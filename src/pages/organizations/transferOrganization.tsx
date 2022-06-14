import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableHead,
  TableCell,
  TableBody,
  TableRow, TablePagination
} from "@mui/material";
import * as React from "react";
import {useEffect, useState} from "react";
import {NoticeRef} from "@/components/Notice";
import {createOrg, deleteOri, getOriMumbers, getOriRes, transferOri} from "@/utils/api/org";
import styles from './index.module.scss';

interface Props {
  transferModalVisible: boolean,
  transferSuccessCb: () => void,
  setTransferModalVisible: (val: boolean) => void,
  transferId: number
}

const TransferOrganization = (props: Props) => {
  let {transferModalVisible, transferSuccessCb, setTransferModalVisible, transferId} = props;
  const [userList, setUserList] = useState<getOriRes[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1)

  useEffect(() => {
    if (transferModalVisible) {
      getOriMumbers({org_id: transferId, page: 1, page_size: 10}).then(res => {
        setUserList(res);
        console.warn(res)
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

  function pageChange(e, params: any){
    console.warn(params)
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
      <TablePagination
        rowsPerPageOptions={[10]}
        count={16}
        onPageChange={pageChange}
        page={0}
        rowsPerPage={4}
        // rowsPerPageOptions={}
        // labelDisplayedRows={(a) => {
        //   console.warn(a)
        //
        // }}
      />
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

export default TransferOrganization;
