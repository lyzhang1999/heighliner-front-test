import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, forwardRef, useEffect, useState} from "react";
import styles from "./index.module.scss";
import {TextField, Select, MenuItem, Switch} from "@mui/material";
import clsx from "clsx";
import {cloneDeep, filter, get, set} from "lodash-es";
import {FieldsMap, InitMiddleWareItem, MiddleWareType, NetworkInitData} from "@/components/Application/Create/util";
import {LinkMethod} from "@/pages/[organization]/applications/creation";
import {pathRule} from "@/utils/formRules";
import {FormStateType} from "@/pages/[organization]/applications/creation/context";

const IconFocusStyle = {}

const SelectStyle = {}

export interface Props {
  submitCb: Function,
  formState: FormStateType,
  networkConfig: any[]
}

export const Middles = [
  {
    key: "postgres",
    name: 'Postgres'
  }
]

const NetworkConfig = forwardRef(function Component(props: Props, ref) {
  const {submitCb, formState} = props;
  let {middleWares, selectAStack, networkData, microService} = formState;
  let {[FieldsMap.name]: name} = selectAStack;

  function getDefaultValue(): MiddleWareType {
    let defaultValue = cloneDeep(InitMiddleWareItem);
    set(defaultValue, 'otherValue.names.0.v', name.toLowerCase().replace(/-/g, '_'));
    // set(defaultValue, 'otherValue.names.0.v', '123');
    return defaultValue;
  }

  const {control, handleSubmit, setValue, formState: {errors}, getValues, watch} = useForm({
    defaultValues: {
      network: cloneDeep(networkData)
    },
  });

  let [reload, setReload] = useState(null);

  // force reload the component, beceuse the select component can`t get new disable value
  useEffect(() => {
    setReload(null);
  }, [watch()])

  const {fields, append, remove} = useFieldArray({
    control,
    name: "network"
  });

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(submit)()
  }));

  function submit(value: { network: MiddleWareType[] }) {
    submitCb("networkData", value.network)
  }

  useImperativeHandle(ref, () => ({
    submit: (flag: LinkMethod) => {
      if (flag === LinkMethod.BACK) {
        backCb();
      } else {
        handleSubmit(submit)()
      }
    }
  }));

  function backCb() {
    submitCb('networkData', getValues('network'), true)
  }

  return (
    <>
      <form onSubmit={handleSubmit(submit)}>
        <div className={clsx(styles.header, styles.inputItem)}>
          <div className={styles.left}>Path</div>
          {/*<div className={styles.left}>Port</div>*/}
          <div className={styles.center}>Select Service</div>
          <div className={styles.line}></div>
          <div className={styles.right}>Rewite</div>
        </div>
        <div className={styles.item}>
          {fields.map((item, index) => (
            <div key={item.id} className={styles.inputItem}>
              <div className={styles.left}>
                <Controller
                  name={`network.${index}.path`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      fullWidth
                    />
                  )}
                  rules={{
                    ...pathRule,
                    validate: {
                      unconformity: (value) => {
                        if (filter(getValues("network"), item => item.path === value).length > 1) {
                          return "There can`t be same path";
                        }
                      }
                    }
                  }}
                />
                {
                  get(errors, `network.${index}.path.message`) &&
                  <div className={styles.error}>{get(errors, `network.${index}.path.message`)}</div>
                }
              </div>
              {/*<div className={styles.left}>*/}
              {/*  <Controller*/}
              {/*    name={`network.${index}.port`}*/}
              {/*    control={control}*/}
              {/*    render={({field}) => (*/}
              {/*      <TextField*/}
              {/*        size="small"*/}
              {/*        sx={IconFocusStyle}*/}
              {/*        value={field.value}*/}
              {/*        onChange={field.onChange}*/}
              {/*        fullWidth*/}
              {/*      />*/}
              {/*    )}*/}
              {/*    rules={{*/}
              {/*      ...portRule*/}
              {/*    }}*/}
              {/*  />*/}
              {/*  {*/}
              {/*    get(errors, `network.${index}.port.message`) &&*/}
              {/*    <div className={styles.error}>{get(errors, `network.${index}.port.message`)}</div>*/}
              {/*  }*/}
              {/*</div>*/}
              <div className={styles.center}>
                <Controller
                  name={`network.${index}.service`}
                  control={control}
                  render={({field}) => (
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      size="small"
                      sx={SelectStyle}
                      fullWidth
                    >
                      {
                        microService.map(item => {
                          return <MenuItem value={item.serviceName} key={item.serviceName}
                            // disabled={getDisableValue(field.value, item.key, index)}
                          >{item.serviceName}</MenuItem>
                        })
                      }
                    </Select>
                  )}
                  rules={{required: 'Please select a service'}}
                />
                {
                  get(errors, `network.${index}.service.message`) &&
                  <div className={styles.error}>{get(errors, `network.${index}.service.message`)}</div>
                }
              </div>
              <div className={styles.right}>
                <Controller
                  name={`network.${index}.rewrite`}
                  control={control}
                  render={({field}) => (
                    <Switch checked={field.value} onChange={field.onChange}/>
                  )}
                />
                <img src="/img/application/delete.svg" alt="" onClick={() => remove(index)}
                     className={styles.deleteIcon}/>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.add} onClick={() => append(cloneDeep(NetworkInitData))}>
          <span className={styles.addDesc}>ADD ONE</span>
        </div>
      </form>
      {/*{*/}
      {/*  modalDisplay &&*/}
      {/*  <MiddleDrawer{...{*/}
      {/*    setModalDisplay,*/}
      {/*    modalDisplay,*/}
      {/*    successCb,*/}
      {/*    drawerInitState*/}
      {/*  }}/>*/}
      {/*}*/}
    </>
  );
})

export default NetworkConfig;
