import {
  Box,
  Button,
  TextField,
  Drawer,
} from '@mui/material';

import React, {useEffect, useState} from "react";
import styles from './index.module.scss';
import hljs from 'highlight.js';
import yaml from 'highlight.js/lib/languages/yaml';
import 'highlight.js/styles/a11y-dark.css';

import http from "@/utils/axios";
import {getOriginzationByUrl} from "@/utils/utils";
import {NoticeRef} from "@/components/Notice";


interface Props {
  modalDisplay: boolean
  setModalDispay: (dispaly: any) => void,
  successCb?: () => {},
}

const buttonStyles = {
  marginRight: "10px",
}

const NewClusterModal = ({modalDisplay, setModalDispay, successCb}: Props) => {
  // useEffect(() => {
  //   if (modalDisplay) {
  //     setTimeout(() => {
  //       let dom = document.querySelector("#heightWrapper")
  //       console.warn(dom);
  //       hljs.highlightElement(dom);
  //       hljs.registerLanguage('yaml', yaml);
  //
  //     }, 1000)
  //   }
  // }, [modalDisplay])

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
    if (!configName) {
      NoticeRef.current?.open({
        message: "Please input cluster name",
        type: "error",
      });
      return;
    }
    if (!configValue) {
      NoticeRef.current?.open({
        message: "Please input kube config",
        type: "error",
      });
      return;
    }
    http.post(`/orgs/${getOriginzationByUrl()}/clusters`,
      {
        "kubeconfig": configValue,
        "name": configName,
        "provider": "kubeconfig"
      }
    ).then(res => {
      setModalDispay(false);
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
                  // defaultValue=""
                  onChange={handleConfigName}
                />
              </div>
              <div>
                <TextField
                  label="Kube Config"
                  multiline
                  rows={6}
                  value={configValue}
                  onChange={handleConfigValue}
                />
              </div>
            </Box>
          </div>
          <div className={styles.bottom}>
            <Button
              variant="outlined"
              sx={buttonStyles}
              onClick={() => setModalDispay(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              // sx={buttonStyles}
              onClick={handleConfirm}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Drawer>


      {/*<Dialog*/}
      {/*  open={modalDisplay}*/}
      {/*  onClose={() => setModalDispay(false)}*/}
      {/*  aria-labelledby="alert-dialog-title"*/}
      {/*  aria-describedby="alert-dialog-description"*/}
      {/*>*/}
      {/*  <DialogTitle id="alert-dialog-title">*/}
      {/*    Create a new Cluster*/}
      {/*  </DialogTitle>*/}
      {/*  <DialogContent>*/}
      {/*    <div className={styles.content}>*/}
      {/*      <Box*/}
      {/*        component="form"*/}
      {/*        sx={{*/}
      {/*          width: "100%",*/}
      {/*          '& .MuiTextField-root': {marginTop: "20px", width: '100%'},*/}
      {/*        }}*/}
      {/*        noValidate*/}
      {/*        autoComplete="off"*/}
      {/*      >*/}
      {/*        <div>*/}
      {/*          <TextField*/}
      {/*            id="outlined-multiline-flexible"*/}
      {/*            label="Name"*/}
      {/*            multiline*/}
      {/*            maxRows={4}*/}
      {/*            value={value}*/}
      {/*            defaultValue=""*/}
      {/*            onChange={handleChange}*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*        <div>*/}
      {/*          <TextField*/}
      {/*            id="outlined-multiline-static"*/}
      {/*            label="Kube Config"*/}
      {/*            multiline*/}
      {/*            rows={6}*/}
      {/*            defaultValue=""*/}
      {/*          />*/}
      {/*        </div>*/}
      {/*      </Box>*/}
      {/*    </div>*/}
      {/*  </DialogContent>*/}
      {/*  <DialogActions>*/}
      {/*    <Button onClick={() => setModalDispay(false)}>Cancel</Button>*/}
      {/*    <Button*/}
      {/*      onClick={modalConfirm}*/}
      {/*      variant="contained"*/}
      {/*    >*/}
      {/*      Confirm*/}
      {/*    </Button>*/}
      {/*  </DialogActions>*/}
      {/*</Dialog>*/}
    </div>
  )
}


export default NewClusterModal;
