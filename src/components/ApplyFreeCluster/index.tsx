import React, { useEffect, useState } from "react";
import clsx from "clsx";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Paper,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { formatDate, getOriIdByContext, Message } from "@/utils/utils";
import {
  ClusterApplicationStatus,
  createClusterApplication,
  getClusterApplication,
  GetClusterApplicationRes,
} from "@/api/cluster/application";
import { getClusterList } from "@/api/cluster";

interface Props extends CommonProps {
  showType?: "Draw";
  DrawSuccessCb?: () => void;
}

enum LocalStorageKV {
  K_HAVE_APPLIED = "K_HAVE_APPLIED",
  V_HAVE_APPLIED = "V_HAVE_APPLIED",
}

export default function ApplyFreeCluster({
  showType,
  DrawSuccessCb,
}: Props): React.ReactElement {
  const [openDialog, setOpenDialog] = useState(false);
  const handleOpenDialog = () => setOpenDialog(true);
  const handleCloseDialog = () => setOpenDialog(false);

  const [detail, setDetail] = useState<GetClusterApplicationRes[number]>();
  const [openDetailDialog, setOpenDetailDialog] = useState(false);
  const handleOpenDetailDialog =
    (detail: GetClusterApplicationRes[number]) => () => {
      setDetail(detail);
      setOpenDetailDialog(true);
    };
  const handleCloseDetailDialog = () => setOpenDetailDialog(false);

  const [clusterApplication, setClusterApplication] =
    useState<GetClusterApplicationRes>([]);

  useEffect(() => {
    getClusterList().then((res) => {
      // Check whether have cluster
      if (res.length <= 0) {
        // Check whether have applied cluster.
        getClusterApplication(+getOriIdByContext()).then((res) => {
          if (res.length <= 0) {
            handleOpenDialog();
          }
          setClusterApplication(res);
        });
      }
    });
  }, []);

  const handleApply = () => {
    createClusterApplication(+getOriIdByContext()).then((res) => {
      Message.success("You application is submit.");
      if (showType && showType === "Draw") {
        DrawSuccessCb && DrawSuccessCb();
      } else {
        handleCloseDialog();
      }
    });
  };

  if (showType && showType === "Draw") {
    return (
      <Stack gap="20px">
        <DialogContentText>
          ForkMain is beta stage currently. Now you can apply a new cluster to
          freely navigate our platform without any cost. 🚀
        </DialogContentText>
        <Button
          variant="contained"
          onClick={handleApply}
          sx={{
            alignSelf: "flex-end",
            marginRight: "50px",
          }}
        >
          Apply
        </Button>
        {clusterApplication.length >= 1 && (
          <>
            <Divider
              variant="middle"
              sx={{
                marginTop: "20px",
              }}
            >
              Cluster Application Record
            </Divider>
            <Stack gap="10px" alignItems="center">
              <TableContainer component={Paper}>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>ID</TableCell>
                      <TableCell align="justify">APPLICANT</TableCell>
                      <TableCell align="justify">STATUS</TableCell>
                      <TableCell align="center">DETAIL</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {clusterApplication.map((application) => (
                      <TableRow
                        key={application.id}
                        sx={{
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        <TableCell>{application.id}</TableCell>
                        <TableCell>{application.user_nickname}</TableCell>
                        <TableCell>{application.status}</TableCell>
                        <TableCell>
                          <IconButton
                            onClick={handleOpenDetailDialog(application)}
                          >
                            <ExitToAppIcon />
                          </IconButton>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Stack>
            <Dialog open={openDetailDialog} onClose={handleCloseDetailDialog}>
              <DialogTitle>Cluster Application Detail</DialogTitle>
              <DialogContent>
                <List
                  sx={{
                    minWidth: "500px",
                  }}
                >
                  <ListItem>
                    <Grid container>
                      <Grid item xs={4}>
                        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.54)" }}>
                          ID
                        </ListItemText>
                      </Grid>
                      <Grid item xs={8}>
                        <ListItemText>{detail?.id}</ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={4}>
                        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.54)" }}>
                          APPLICANT
                        </ListItemText>
                      </Grid>
                      <Grid item xs={8}>
                        <ListItemText>{detail?.user_nickname}</ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={4}>
                        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.54)" }}>
                          ORGANIZATION
                        </ListItemText>
                      </Grid>
                      <Grid item xs={8}>
                        <ListItemText>{detail?.org_name}</ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                  <ListItem>
                    <Grid container>
                      <Grid item xs={4}>
                        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.54)" }}>
                          STATUS
                        </ListItemText>
                      </Grid>
                      <Grid item xs={8}>
                        <ListItemText>{detail?.status}</ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                  {detail &&
                    detail.status === ClusterApplicationStatus.REJECTED && (
                      <ListItem>
                        <Grid container>
                          <Grid item xs={4}>
                            <ListItemText sx={{ color: "rgba(0, 0, 0, 0.54)" }}>
                              REASON
                            </ListItemText>
                          </Grid>
                          <Grid item xs={8}>
                            <ListItemText>{detail?.reason}</ListItemText>
                          </Grid>
                        </Grid>
                      </ListItem>
                    )}
                  <ListItem>
                    <Grid container>
                      <Grid item xs={4}>
                        <ListItemText sx={{ color: "rgba(0, 0, 0, 0.54)" }}>
                          APPLIED AT{" "}
                        </ListItemText>
                      </Grid>
                      <Grid item xs={8}>
                        <ListItemText>
                          {formatDate((detail?.created_at ?? 0) * 1000)}
                        </ListItemText>
                      </Grid>
                    </Grid>
                  </ListItem>
                </List>
              </DialogContent>
            </Dialog>
          </>
        )}
      </Stack>
    );
  }

  return (
    <Dialog onClose={handleCloseDialog} open={openDialog}>
      <DialogTitle>Free Cluster Application</DialogTitle>
      <DialogContent>
        <DialogContentText>
          ForkMain current is beta stage. Now you can apply a new cluster to
          freely navigate our platform without any cost. 🚀
        </DialogContentText>
        <DialogActions>
          <Button variant="outlined" onClick={handleCloseDialog}>
            Cancel
          </Button>
          <Button variant="contained" onClick={handleApply}>
            Apply
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}
