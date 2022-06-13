import Layout from "@/components/Layout";
import {Button} from "@mui/material";
import styles from './index.module.scss';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import {TablePagination} from "@mui/material";
import {isBrowser} from "@/utils/utils";
import * as React from "react";
import {useContext, useEffect} from "react";
import {Context} from "@/utils/store";
import {useRouter} from "next/router";
import {GlobalContxtRef} from "@/components/GlobalContxt";


function createData(
  name: string,
  calories: number,
  fat: number,
  carbs: number,
  protein: number,
) {
  return {name, calories, fat, carbs, protein};
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const Teams = () => {

  const [hasMounted, setHasMounted] = React.useState(false);

  useEffect(() => {
  //   setTimeout(() => {

      let result = GlobalContxtRef?.current?.getState('organizationList');
      console.warn(result)
    // }, 1000)

  }, [])



  // close server render
  React.useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  function pageChange(params, b) {
    console.warn(params)
    console.warn(b)
  }



  return (
    <Layout pageHeader="Teams"
            titleContent={
              <Button variant="contained">
                Invite User
              </Button>
            }
    >
      <div className={styles.teamsWrapper}>
        <Table sx={{minWidth: 650}} aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>UserName</TableCell>
              <TableCell align="right">Role</TableCell>
              <TableCell align="right">Action</TableCell>
              {/*<TableCell align="right">Carbs&nbsp;(g)</TableCell>*/}
              {/*<TableCell align="right">Protein&nbsp;(g)</TableCell>*/}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.name}
                sx={{'&:last-child td, &:last-child th': {border: 0}}}
              >
                <TableCell component="th" scope="row">
                  {row.name}
                </TableCell>
                <TableCell align="right">{row.calories}</TableCell>
                <TableCell align="right">{row.fat}</TableCell>
                {/*<TableCell align="right">{row.carbs}</TableCell>*/}
                {/*<TableCell align="right">{row.protein}</TableCell>*/}
              </TableRow>
            ))}

          </TableBody>
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
        </Table>
      </div>
    </Layout>
  )
}

export default Teams;
