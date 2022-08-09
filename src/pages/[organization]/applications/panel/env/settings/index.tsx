import React, { createContext, useState } from "react";
import clsx from "clsx";
import { useRouter } from "next/router";
import {
  Breadcrumbs,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Link,
  Skeleton,
  Typography,
} from "@mui/material";
import { get } from "lodash-es";

import { CommonProps } from "@/utils/commonType";
import Layout from "@/components/Layout";
import SingleCollapsiblePanel from "@/basicComponents/SingleCollapsiblePanel";
import {
  getOrganizationNameByUrl,
  getQuery,
  getUrlEncodeName,
  Message,
} from "@/utils/utils";
import { deleteEnv, GetEnvSettingRes, getProdEnv } from "@/api/application";
import { useGlobalLoading } from "@/hooks/GlobalLoading";
import Frontend from "@/components/Panel/EnvList/Setting/Frontend";
import Backend from "@/components/Panel/EnvList/Setting/Backend";
import useApplication from "@/hooks/application";
import useEnv from "@/hooks/env";

import styles from "./index.module.scss";

interface Props extends CommonProps {}

export default function Settings(props: Props): React.ReactElement {
  const [openDialog, setOpenDialog] = useState(false);
  const [disableDelete, setDisableDelete] = useState(false);
  const router = useRouter();

  const app_id = +getQuery("app_id");
  const env_id = +getQuery("env_id");

  const [application] = useApplication({ app_id: +app_id });
  const [env] = useEnv({
    app_id,
    env_id,
  });

  const { setGlobalLoading } = useGlobalLoading();

  const handleOpenDialog = () => {
    // Unable to delete environment if it is main/master env.
    getProdEnv(String(app_id)).then((res) => {
      if (res.id === +env_id) {
        setDisableDelete(true);
      }
    });
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleDeleteEnv = () => {
    handleCloseDialog();
    setGlobalLoading(true);
    deleteEnv({
      app_id,
      env_id,
    }).then(() => {
      Message.success("Delete environment successfully.");
      const app_id = getQuery("app_id");
      const release_id = getQuery("release_id");
      setGlobalLoading(false);
      router.push(
        `/${getUrlEncodeName()}/applications/panel?app_id=${app_id}&release_id=${release_id}`
      );
    });
  };

  return (
    <Layout
      notStandardLayout
      breadcrumbs={
        <Breadcrumbs separator="›">
          <Link
            onClick={() =>
              router.push(
                `/${encodeURIComponent(
                  getOrganizationNameByUrl()
                )}/applications`
              )
            }
            underline="hover"
            color="inherit"
            sx={{
              cursor: "pointer",
              fontSize: "25px",
              fontFamily: "OpenSans",
            }}
          >
            Applications
          </Link>
          <Link
            onClick={() =>
              router.push({
                pathname: `/${encodeURIComponent(
                  getOrganizationNameByUrl()
                )}/applications/panel`,
                query: {
                  app_id: router.query.app_id,
                  release_id: router.query.release_id,
                },
              })
            }
            underline="hover"
            color="inherit"
            sx={{
              cursor: "pointer",
              fontSize: "25px",
              fontFamily: "OpenSans",
            }}
          >
            {application?.name || <Skeleton variant="text" width={100} />}
          </Link>
          <Link
            onClick={() =>
              router.push({
                pathname: `/${encodeURIComponent(
                  getOrganizationNameByUrl()
                )}/applications/panel/env`,
                query: {
                  app_id: router.query.app_id,
                  release_id: router.query.release_id,
                  env_id: router.query.env_id,
                },
              })
            }
            underline="hover"
            color="inherit"
            sx={{
              cursor: "pointer",
              fontSize: "25px",
              fontFamily: "OpenSans",
            }}
          >
            {get(env, "name", "") || <Skeleton variant="text" width={100} />}
          </Link>
          <Typography
            color={"text.primary"}
            sx={{
              fontSize: "25px",
              fontFamily: "OpenSans",
            }}
          >
            settings
          </Typography>
        </Breadcrumbs>
      }
    >
      <div className={styles.wrapper}>
        <Typography
          variant="h1"
          sx={{
            fontSize: 25,
            fontFamily: "Roboto",
          }}
        >
          Environment settings(feat-shop)
        </Typography>
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          <SingleCollapsiblePanel title="Frontend" defaultIsExpanded={true}>
            <Frontend />
          </SingleCollapsiblePanel>
          <SingleCollapsiblePanel title="Backend" defaultIsExpanded={true}>
            <Backend />
          </SingleCollapsiblePanel>
          <SingleCollapsiblePanel title="Danger Zone" defaultIsExpanded={true}>
            <div>
              <Button
                variant="contained"
                color="error"
                onClick={handleOpenDialog}
              >
                Delete This Environment
              </Button>
            </div>
          </SingleCollapsiblePanel>
        </div>
      </div>
      <Dialog open={openDialog} onClose={handleCloseDialog}>
        <DialogTitle>
          {disableDelete
            ? "Unable to Delete Main/Master Environment"
            : "Delete This Environment"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {disableDelete
              ? "Current environment is Main/Master which can't be delete directly."
              : "Please make sure you want to delete this environment because this operation is unrecoverable."}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Cancel
          </Button>
          <Button
            variant="outlined"
            color="error"
            onClick={handleDeleteEnv}
            disabled={disableDelete}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Layout>
  );
}
