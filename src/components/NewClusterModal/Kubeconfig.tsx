/**
 * Kubeconfig panel
 */

import React, {useEffect} from "react";
import {
  Button,
  TextField,
} from '@mui/material';
import {get, trim} from "lodash-es";

import {Message} from "@/utils/utils";
import {createCluster, CreateClusterReq} from "@/api/cluster";

import styles from './index.module.scss';
import {Controller, useForm} from "react-hook-form";

interface Props {
  modalDisplay: boolean,
  successCb?: () => void,
}

export const KubeconfigPanel = ({
                                  modalDisplay,
                                  successCb,
                                }: Props): React.ReactElement => {

  const {control, handleSubmit, formState: {errors}, setValue} = useForm({
    defaultValues: {
      name: "",
      kubeconfig: "",
      ingress_lb_address: "",
    }
  });

  useEffect(() => {
    setValue('kubeconfig', '');
    setValue('name', '');
    setValue('ingress_lb_address', '');
  }, [modalDisplay])

  function onSubmit(value: CreateClusterReq) {
    let {name, kubeconfig, ingress_lb_address} = value;
    if (!trim(name)) {
      Message.error("Please input cluster name");
      return;
    }
    if (!trim(kubeconfig)) {
      Message.error("Please input kube config");
      return;
    }
    createCluster({
      "name": trim(name),
      "kubeconfig": trim(kubeconfig),
      "provider": "kubeconfig",
      ingress_lb_address,
    }).then(() => {
      successCb && successCb();
    })
  }

  return (
    <div className={styles.content}>
      <div className={styles.formWrapper}>
        <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
          <div className={styles.label}>
            Name *
          </div>
          <Controller
            name="name"
            control={control}
            render={({field}) => (
              <TextField
                size="small"
                value={field.value}
                fullWidth
                onChange={field.onChange}
                error={Boolean(get(errors, ['name', 'message']))}
                helperText={get(errors, ['name', 'message'])}
              />
            )}
            rules={{required: "Please input the cluster name"}}
          />
          <div className={styles.label}>
            Kubeconfig *
          </div>
          <Controller
            name="kubeconfig"
            control={control}
            render={({field}) => (
              <TextField
                size="small"
                value={field.value}
                fullWidth
                rows={8}
                multiline
                onChange={field.onChange}
                error={Boolean(get(errors, ['kubeconfig', 'message']))}
                helperText={get(errors, ['kubeconfig', 'message'])}
              />
            )}
            rules={{required: "Please input kube config"}}
          />
          <div className={styles.label}>
            Public Ingress IP
          </div>
          <Controller
            name="ingress_lb_address"
            control={control}
            render={({field}) => (
              <TextField
                size="small"
                value={field.value}
                fullWidth
                onChange={field.onChange}
                error={Boolean(get(errors, ['ingress_lb_address', 'message']))}
                helperText={get(errors, ['ingress_lb_address', 'message'])}
              />
            )}
            rules={{
              pattern: {
                value: /((25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))\.){3}(25[0-5]|2[0-4]\d|((1\d{2})|([1-9]?\d)))/,
                message:
                  "Pleact input a correct ip address",
              },
            }}
          />
          <div className={styles.help}>
            <img src="/img/gitprovider/InfoOutlined.webp" alt=""/>
            <span className={styles.desc}>
          How to get kubeconfig content?
        </span>
          </div>
          <div className={styles.copyCode}>
            <div className={styles.code}>
              kubectl config view --minify --raw --flatten
            </div>
          </div>
          <div className={styles.bottom}>
            <Button
              style={{marginLeft: '37px'}}
              variant="contained"
              type="submit"
            >
              add
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
