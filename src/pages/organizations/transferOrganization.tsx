import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  Table,
  TableCell,
  TableBody,
  TableRow, TablePagination
} from "@mui/material";
import * as React from "react";
import {useContext, useEffect, useState} from "react";
import {NoticeRef} from "@/components/Notice";
import {getOrgMembers, GetOrgMembersRes, transferOri} from "@/utils/api/org";
import styles from './index.module.scss';
import {Context} from "@/utils/store";
import {get} from "lodash-es";

interface Props {
  transferModalVisible: boolean,
  transferSuccessCb: () => void,
  setTransferModalVisible: (val: boolean) => void,
  transferId: number
}

const TransferOrganization = (props: Props) => {
  let {transferModalVisible, transferSuccessCb, setTransferModalVisible, transferId} = props;
  const {state} = useContext(Context);
  const user_id = get(state, 'currentOrganization.user_id', "");
  const [userList, setUserList] = useState<GetOrgMembersRes["data"]>([]);
  const [total, setTotal] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [count, setCount] = useState<number>(0)

  useEffect(() => {
    if (transferModalVisible) {
      getList();
    }
  }, [transferModalVisible])

  function getList() {
    getOrgMembers({org_id: transferId, page: page, page_size: 10}).then(res => {
      setUserList(res.data);
      let {total, pageCount} = res.pagination;
      setTotal(total);
      setCount(pageCount);
    })
  }

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

  function pageChange(e: any, params: number) {
    setPage(params + 1);
    getList();
  }

  return (
    <Dialog
      open={transferModalVisible}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Select one user to transfer ownership to them.
      </DialogTitle>
      <DialogContent id="alert-dialog-title" className={styles.transferTable}>
        <Table aria-label="simple table">
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
                  <Button onClick={() => transferIt(row.user_id)}
                          disabled={user_id === row.user_id}
                  >
                    Transfer
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </DialogContent>
      {
        count === 1 && <TablePagination
          rowsPerPageOptions={[10]}
          count={total}
          onPageChange={pageChange}
          page={page - 1}
          rowsPerPage={10}
        />
      }
    </Dialog>
  )
}

export default TransferOrganization;
