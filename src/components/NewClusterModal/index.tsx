import {
  Box,
  Button,
  TextField,
  Drawer,
} from '@mui/material';
import React, {useEffect, useState} from "react";
import {createCluster} from "@/utils/api/cluster";
import {trim} from "lodash-es";
import styles from './index.module.scss';
import {Message} from "@/utils/utils";

interface Props {
  modalDisplay: boolean
  setModalDisplay: (dispaly: any) => void,
  successCb?: () => void,
}

const buttonStyles = {
  marginRight: "10px",
}

const NewClusterModal = ({modalDisplay, setModalDisplay, successCb}: Props) => {

  const [configName, setConfigName] = useState<string>('');
  const handleConfigName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigName(event.target.value);
  };

  const [configValue, setConfigValue] = useState<string>('');
  const handleConfigValue = (event: React.ChangeEvent<HTMLInputElement>) => {
    setConfigValue(event.target.value);
  };

  useEffect(() => {
    setConfigName("");
    setConfigValue("")
  }, [modalDisplay])

  function handleConfirm() {

    if (!trim(configName)) {
      Message.error("Please input cluster name");
      return;
    }
    if (!trim(configValue)) {
      Message.error("Please input kube config");
      return;
    }
    createCluster({
      "kubeconfig": trim(configValue),
      "name": trim(configName),
      "provider": "kubeconfig"
    }).then(res => {
      setModalDisplay(false);
      successCb && successCb();
    })
  }

  return (
    <div>
      <Drawer
        anchor="right"
        open={modalDisplay}
      >
        <div className={styles.drawerWrap}>
          <div className={styles.header}>
            Create a new cluster
          </div>
          <div className={styles.content}>
            <Box
              component="form"
              sx={{
                width: "100%",
                '& .MuiTextField-root': {marginTop: "20px", width: '100%'},
              }}
              noValidate
              autoComplete="off"
            >
              <div>
                <TextField
                  label="Name"
                  multiline
                  maxRows={4}
                  value={configName}
                  onChange={handleConfigName}
                  // color="textColor"
                />
              </div>
              <div>
                <TextField
                  label="Kube Config"
                  multiline
                  rows={8}
                  value={configValue}
                  // color="textColor"
                  onChange={handleConfigValue}
                />
              </div>
            </Box>
          </div>
          <div className={styles.bottom}>
            <Button
              variant="outlined"
              sx={buttonStyles}
              onClick={() => setModalDisplay(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  )
}

export default NewClusterModal;
