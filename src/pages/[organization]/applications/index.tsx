import React, { useState, useEffect } from "react";
import {
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import Layout from "@/components/Layout";
import styles from "./index.module.scss";
import { useRouter } from "next/router";
import { getOrganizationNameByUrl } from "@/utils/utils";
import { ApplicationObject, getApplicationList } from "@/utils/api/application";
import ApplicationList from "@/components/ApplicationList";

const Applications = () => {
  const [applist, setApplist] = useState<ApplicationObject[]>([]);

  const router = useRouter();

  useEffect(() => {
    getApplicationList().then((res) => {
      setApplist(res.data);
    });
  }, []);

  function goPanel(appId: number, releaseId: number) {
    const queryParameters = new URLSearchParams({
      app_id: appId.toString(),
      release_id: releaseId.toString(),
    });
    router.push(
      `/${getOrganizationNameByUrl()}/applications/panel?${queryParameters.toString()}`
    );
  }

  return (
    <Layout
      pageHeader="APPLICATIONS"
      titleContent={
        <Button
          variant="contained"
          onClick={() => {
            router.push(
              `/${encodeURIComponent(
                getOrganizationNameByUrl()
              )}/applications/creation`
            );
          }}
        >
          Create a Application
        </Button>
      }
    >
      <ApplicationList list={applist}/>


      {/*<div className={styles.tableWrapper}>*/}
      {/*  <Table sx={{}} aria-label="simple table">*/}
      {/*    <TableHead>*/}
      {/*      <TableRow>*/}
      {/*        <TableCell>Name</TableCell>*/}
      {/*        /!*<TableCell align="right">Created Time </TableCell>*!/*/}
      {/*        <TableCell align="right">Status</TableCell>*/}
      {/*        <TableCell align="right">Action</TableCell>*/}
      {/*      </TableRow>*/}
      {/*    </TableHead>*/}
      {/*    <TableBody>*/}
      {/*      {applist.map((row) => {*/}
      {/*        return (*/}
      {/*          <TableRow*/}
      {/*            key={row.app_name}*/}
      {/*            sx={{ "&:last-child td, &:last-child th": { border: 0 } }}*/}
      {/*          >*/}
      {/*            <TableCell component="th" scope="row">*/}
      {/*              {row.app_name}*/}
      {/*            </TableCell>*/}
      {/*            <TableCell align="right">*/}
      {/*              {get(row, "last_release.status", "")}*/}
      {/*            </TableCell>*/}
      {/*            <TableCell align="right">*/}
      {/*              <Button*/}
      {/*                sx={{ cursor: "pointer" }}*/}
      {/*                // color="error"*/}
      {/*                onClick={() => {*/}
      {/*                  goPanel(row.app_id, row.last_release.id);*/}
      {/*                }}*/}
      {/*              >*/}
      {/*                GoPanel*/}
      {/*              </Button>*/}
      {/*            </TableCell>*/}
      {/*          </TableRow>*/}
      {/*        );*/}
      {/*      })}*/}
      {/*    </TableBody>*/}
      {/*  </Table>*/}
      {/*</div>*/}
    </Layout>
  );
};
export default Applications;
