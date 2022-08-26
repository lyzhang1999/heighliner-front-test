import React from "react";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {TextField, InputAdornment, Button} from "@mui/material";
import styles from "./middleDrawer.module.scss";
import {get} from "lodash-es";
import RightDrawer from "@/basicComponents/RightDrawer";
import { Message } from "@/utils/utils";

const IconFocusStyle = {width: "200px"}

export interface PgTypes {
  names: { v: string }[],
  username: string,
  password: string,
  storage: string
}

interface Props {
  modalDisplay: boolean,
  setModalDisplay: (dispaly: any) => void,
  successCb: (value: PgTypes) => void,
  drawerInitState: PgTypes | null
}

export default function MiddleDrawer({setModalDisplay, successCb, modalDisplay, drawerInitState}: Props) {
  // @ts-ignore
  let {names, username, password, storage} = drawerInitState;
  const {control, handleSubmit, formState: {errors}, getValues} = useForm({
    defaultValues: {
      names: names || [{v: ''}],
      username: username || 'postgres',
      password: password || 'password',
      storage: storage || '10'
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: "names"
  });

  function submit(value: PgTypes) {
    Message.success('Configuration Saved.', {
      showTime: 2
    });
    successCb(value)
    setModalDisplay(false);
  }

  return (
    <RightDrawer{...{
      modalDisplay,
      setModalDisplay,
      title: "Middleware Configuration",
    }}>
      <div className={styles.drawerWrap}>
        <form onSubmit={handleSubmit(submit)}>
          <div className={styles.content}>
            <div className={styles.formItem}>
              <div className={styles.left}>
                Username:
              </div>
              <div className={styles.right}>
                <Controller
                  name={`username`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  rules={{required: "Please input the username"}}
                />
                {
                  errors.username?.message &&
                  <div className={styles.error}>{errors.username?.message}</div>
                }
              </div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.left}>
                Password:
              </div>
              <div className={styles.right}>
                <Controller
                  name={`password`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                    />
                  )}
                  rules={{required: "Please input the password"}}
                />
                {
                  errors.password?.message &&
                  <div className={styles.error}>{errors.password?.message}</div>
                }
              </div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.left}>
                Storage:
              </div>
              <div className={styles.right}>
                <Controller
                  name={`storage`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      InputProps={{
                        endAdornment: <InputAdornment position="start">Gi</InputAdornment>,
                      }}
                    />
                  )}
                  rules={{
                    required: "Please Input the storage",
                    validate: {
                      unconformity: (value) => {
                        if (!/^[0-9]+$/.test(value)) {
                          return "Pelese input a number";
                        }
                        if (Number(value) < 10) {
                          return "The min value is 10";
                        }
                        if (Number(value) > 50) {
                          return "The max value is 50";
                        }
                      }
                    }
                  }}
                />
                {
                  errors.storage?.message &&
                  <div className={styles.error}>{errors.storage?.message}</div>
                }
              </div>
            </div>
            <div className={styles.formItem}>
              <div className={styles.left}>
                Database:
              </div>
              <div className={styles.right}>
                {
                  fields.map((item, index) => {
                    return (
                      <div key={item.id} className={styles.nameInputItem}>
                        <div className={styles.input}>
                          <Controller
                            name={`names.${index}.v`}
                            control={control}
                            render={({field}) => (
                              <TextField
                                size="small"
                                sx={IconFocusStyle}
                                value={field.value}
                                onChange={field.onChange}
                              />
                            )}
                            rules={{required: "Please Input the name"}}
                          />
                          {
                            get(errors, `names.${index}.v.message`) &&
                            <div className={styles.error}>{get(errors, `names.${index}.v.message`)}</div>
                          }
                        </div>
                        {/*<img src="/img/application/delete.svg" alt="" onClick={() => remove(index)}*/}
                        {/*     className={styles.deleteIcon}/>*/}
                      </div>
                    )
                  })
                }
                {/*<div className={styles.add} onClick={() => append({v: ''})}>*/}
                {/*  ADD ONE*/}
                {/*</div>*/}
              </div>
            </div>
          </div>

          <div className={styles.actionBtn}>
            <Button
              variant="outlined"
              onClick={() => setModalDisplay(false)}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              type="submit"
            >
              Submit
            </Button>
          </div>
        </form>
      </div>
    </RightDrawer>
  )
}
