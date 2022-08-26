import {Controller, useFieldArray, useForm} from "react-hook-form";
import styles from './serviceItem.module.scss';
import {TextField, Divider, Select, MenuItem, Button} from "@mui/material";
import {cloneDeep, dropRight, filter, find, get, pick, set} from "lodash-es";
import React, {useEffect, useState,} from "react";
import {IconFocusStyle, StaticDeployModeList} from "@/components/Application/Create/FrontEnd";
import clsx from "clsx";
import {getRepoListRes} from "@/api/application";
import {nameRule, portRule} from "@/utils/formRules";
import ImportEnvByJson from "@/components/ImportEnvByJson";
import ImportEnvFileByJson from "@/components/ImportEnvFileByJson";
import {EnvType, FrameWorksList, ImageList} from "@/components/Application/Create/util";
import {FormStateType} from "@/pages/[organization]/applications/creation/context";

export interface Props {
  repoList: getRepoListRes[] | boolean,
  currentIndex: any,
  microList: any,
  setSpreadItem: any,
  setMicroList: any,
  isNewFlag: boolean,
}

export default function ServiceItem(p: Props) {
  let {repoList, currentIndex, microList, setSpreadItem, setMicroList, isNewFlag} = p;
  const [render, setRender] = useState<null>(null);
  // let [isRepo, setIsRepo] = useState<boolean>(false);

  let value = get(microList, currentIndex);

  let {
    serviceName,
    isRepo,
    repoUrl,
    framework,
    repoName,
    baseImage,
    buildCommand,
    devCommand,
    runCommand,
    port,
    debugCommand,
    outputDir,
    env,
    staticType
  } = value;

  const {control, handleSubmit, formState: {errors}, getValues, watch, setValue} = useForm({
    defaultValues: {
      serviceName,
      isRepo,
      repoUrl,
      framework,
      repoName,

      baseImage,
      buildCommand,
      devCommand,
      runCommand,
      debugCommand,
      port,
      outputDir,
      env,
      staticType
    },
  });

  const {fields: deployFields, append: deployAppend, remove: deployRemove} = useFieldArray({
    control,
    name: "env"
  });

  useEffect(() => {
    setRender(null);
  }, [watch()])

  // useEffect(() => {
  //   console.warn(getValues("framework"))
  //   const subscription = watch((value, { name, type }) => {
  //     setValue('framework', 'vue')
  //     console.log(value, name, type)
  //   });
  //   return () => subscription.unsubscribe();
  // }, [watch]);

  function frameworkChangeCb(key: string) {
    let currentValue = getValues('framework');
    if ((key === 'other') || (currentValue === key)) {
      return;
    }
    let thisFrameWork: any = find(FrameWorksList, {key: key});
    thisFrameWork = pick(thisFrameWork, [
      "baseImage",
      "buildCommand",
      "devCommand",
      "debugCommand",
      "outputDir",
      "port",
      "staticType",
      "runCommand"
    ])
    Object.keys(thisFrameWork).map(item => {
      // @ts-ignore
      setValue(item, thisFrameWork[item])
    })
  }

  function isRepoChangeCb(value: string) {
    let framework = getValues('framework');
    if (value) {
      if (framework) {
        let thisFrameWork: any = find(FrameWorksList, {key: framework});
        thisFrameWork = pick(thisFrameWork, [
          "baseImage",
          "buildCommand",
          "devCommand",
          "debugCommand",
          "outputDir",
          "port",
          "staticType",
          "runCommand"
        ])
        // @ts-ignore
        Object.keys(thisFrameWork).map(item => {
          setValue(item, thisFrameWork[item])
        })
      }
    } else {
      if (framework === "other") {
        setValue("framework", "");
      }
    }
  }

  function submit(value: any) {
    let list = cloneDeep(microList);
    set(list, currentIndex, value);
    setMicroList(list);
    setSpreadItem(-1);
  }

  function cancel() {
    if (isNewFlag) {
      let list = cloneDeep(microList);
      list.pop();
      setMicroList(list);
      setSpreadItem(-1);
    } else {
      setSpreadItem(-1);
    }
  }

  let props = {
    getValues,
    control,
    errors,
    watch,
    deployFields,
    deployAppend,
    deployRemove
  }

  function addEnvByJson(obj: EnvType[]) {
    deployAppend(obj);
  }

  return (
    <div className={styles.wrapper}>
      <form onSubmit={handleSubmit(submit)}>
        <div className={styles.header}>
          <div className={styles.item}>
            <div className={styles.label}>
              Service Name:
            </div>
            <div className={styles.content}>
              <Controller
                name={`serviceName`}
                control={control}
                render={({field}) => (
                  <TextField
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="service name"
                    autoFocus
                  />
                )}
                rules={{
                  required: "Please enter your service name",
                  validate: {
                    ...nameRule,
                    unconformity: (value) => {
                      let v = cloneDeep(microList);
                      v.splice(currentIndex, 1)
                      if (filter(v, item => item.serviceName === value).length > 0) {
                        return "There can`t be same service name";
                      }
                    }
                  },
                  maxLength: {
                    value: 63,
                    message: "The max length is 63 character.",
                  },
                }}
              />
              {
                errors.serviceName?.message &&
                <div className={styles.error}>{errors.serviceName?.message}</div>
              }
            </div>
            <div className={styles.rightAction}>
            </div>
          </div>
        </div>
        <Divider/>

        <Controller
          name={`isRepo`}
          control={control}
          render={({field}) => (
            <div className={styles.selectTab}>
              <div className={clsx(styles.tab, !field.value && styles.selected)}
                   onClick={() => {
                     isRepoChangeCb(false);
                     field.onChange(false)
                   }}
              >
                Create new repo
              </div>
              <div className={clsx(styles.tab, field.value && styles.selected)}
                   onClick={() => {
                     isRepoChangeCb(true);
                     field.onChange(true)
                   }}
              >
                Use existing repo
              </div>
            </div>
          )}
        />
        <div className={styles.formWrapper}>
          {
            !getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Repo Name*</div>
              <div className={styles.content}>
                <Controller
                  name={`repoName`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      placeholder="repo name"
                    />
                  )}
                  rules={{
                    required: "Please enter your repo name",
                    validate: nameRule,
                    maxLength: {
                      value: 63,
                      message: "The max length is 63 character.",
                    },
                  }}
                />
                {
                  errors.repoName?.message &&
                  <div className={styles.error}>{errors.repoName?.message}</div>
                }
              </div>
            </div>
          }
          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Repository*</div>
              <div className={styles.content}>
                <Controller
                  name={`repoUrl`}
                  control={control}
                  render={({field}) => (
                    <Select
                      value={field.value || undefined}
                      onChange={field.onChange}
                      size="small"
                      sx={{background: "#fff", width: "250px"}}
                      placeholder="select a repo"
                    >
                      {
                        !repoList &&
                        <div className={styles.repoLoading}>
                          <img src="/img/application/create/loading.png" alt="" className={styles.loadingIcon}/>
                          <span className={styles.loadingText}>
                          Loading Repositories List
                        </span>
                        </div>
                      }
                      {
                        repoList && (repoList as getRepoListRes[]).map(item => {
                          return (
                            <MenuItem value={item.url} key={item.url}>{item.repo_name}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  )}
                  rules={{
                    required: "Please select a repo",
                  }}
                />
                {
                  errors.repoUrl?.message &&
                  <div className={styles.error}>{errors.repoUrl?.message}</div>
                }
              </div>
            </div>
          }
          <div className={styles.item}>
            <div className={styles.label}>FrameWork*</div>
            <div className={styles.content}>
              <Controller
                name={`framework`}
                control={control}
                render={({field}) => (
                  <div className={styles.selectWrapper}>
                    {
                      (getValues("isRepo") ? FrameWorksList : dropRight(FrameWorksList)).map(i => {
                        return (
                          <div key={i.name}
                               className={clsx(styles.selectItem, (field.value === i.key) && styles.selected)}
                               onClick={() => {
                                 frameworkChangeCb(i.key);
                                 field.onChange(i.key)
                               }}
                          >
                            {
                              i.img &&
                              <img src={i.img} alt="" style={{width: '40px', "maxHeight": "40px"}}/>
                            }
                            <div className={styles.name}>{i.name}</div>
                          </div>
                        )
                      })
                    }
                  </div>
                )}
                rules={{
                  required: "Please choose a framework",
                }}
              />
              {
                errors.framework?.message &&
                <div className={styles.error}>{errors.framework?.message}</div>
              }
            </div>
          </div>
          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Base Image*</div>
              <div className={styles.content}>
                <Controller
                  name={`baseImage`}
                  control={control}
                  render={({field}) => (

                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      // placeholder="node:16"
                    />

                    // <Select
                    //   value={field.value || undefined}
                    //   onChange={field.onChange}
                    //   size="small"
                    //   sx={{background: "#fff", width: "250px"}}
                    //   placeholder="select a repo"
                    // >
                    //   {
                    //     ImageList.map(item => {
                    //       return (
                    //         <MenuItem value={item} key={item}>{item}</MenuItem>
                    //       )
                    //     })
                    //   }
                    // </Select>
                  )}
                  rules={{
                    required: "Please entry a base image",
                  }}
                />
                {
                  errors.baseImage?.message &&
                  <div className={styles.error}>{errors.baseImage?.message}</div>
                }
              </div>
            </div>
          }


          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Build Command</div>
              <div className={styles.content}>
                <Controller
                  name={`buildCommand`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      // placeholder="yarn install && yarn build"
                    />
                  )}
                  // rules={{required: "Please enter build command"}}
                />
                {
                  errors.buildCommand?.message &&
                  <div className={styles.error}>{errors.buildCommand?.message}</div>
                }
              </div>
            </div>
          }

          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Run Command</div>
              <div className={styles.content}>
                <Controller
                  name={`runCommand`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      // placeholder="yarn install && yarn build"
                    />
                  )}
                  // rules={{required: "Please enter run command"}}
                />
                {
                  errors.runCommand?.message &&
                  <div className={styles.error}>{errors.runCommand?.message}</div>
                }
              </div>
            </div>
          }
          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Debug Command</div>
              <div className={styles.content}>
                <Controller
                  name={`debugCommand`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      // placeholder="run debugger"
                    />
                  )}
                  // rules={{required: "Please enter debug command"}}
                />
                {
                  errors.debugCommand?.message &&
                  <div className={styles.error}>{errors.debugCommand?.message}</div>
                }
              </div>
            </div>
          }

          {
            getValues('isRepo') &&

            <div className={styles.item}>
              <div className={styles.label}>Dev Command</div>
              <div className={styles.content}>
                <Controller
                  name={`devCommand`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      // placeholder="yarn dev"
                    />
                  )}
                  // rules={{...pathRule, required: "Please entry dev command"}}
                />
                {
                  errors.devCommand?.message &&
                  <div className={styles.error}>{errors.devCommand?.message}</div>
                }
              </div>
            </div>

          }
          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Output Directory</div>
              <div className={styles.content}>
                <Controller
                  name={`outputDir`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      // placeholder="dist"
                    />
                  )}
                  // rules={{...pathRule, required: "Please entry output directory"}}
                />
                {
                  errors.outputDir?.message &&
                  <div className={styles.error}>{errors.outputDir?.message}</div>
                }
              </div>
            </div>
          }

          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Port*</div>
              <div className={styles.content}>
                <Controller
                  name={`port`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      onChange={field.onChange}
                      // placeholder="3000"
                    />
                  )}
                  rules={portRule}
                />
                {
                  errors.port?.message &&
                  <div className={styles.error}>{errors.port?.message}</div>
                }
              </div>
            </div>
          }
          {
            getValues("isRepo") &&
            <div className={styles.item}>
              <div className={styles.label}>Static Type</div>
              <div className={styles.content}>
                <Controller
                  name={`staticType`}
                  control={control}
                  render={({field}) => (
                    <Select
                      value={field.value}
                      onChange={field.onChange}
                      size="small"
                      sx={{background: "#fff", width: "250px"}}
                    >
                      {
                        StaticDeployModeList.map(item => {
                          return (
                            <MenuItem value={item.key} key={item.key}>{item.value}</MenuItem>
                          )
                        })
                      }
                    </Select>
                  )}
                  rules={{
                    // required: "Please select static type",
                  }}
                />
                {
                  errors.staticType?.message &&
                  <div className={styles.error}>{get(errors, 'staticType.message', '')}</div>
                }
              </div>
            </div>
          }
          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}>Env Variables</div>
              <div className={styles.content}>
                {deployFields.map((item, index) => (
                  <div key={item.id} className={styles.inputItem}>
                    <div className={styles.left}>
                      <Controller
                        name={`env.${index}.name`}
                        control={control}
                        render={({field}) => (
                          <TextField
                            size="small"
                            sx={{...IconFocusStyle, width: '150px'}}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                        rules={{
                          required: 'Please input env name',
                          validate: {
                            unconformity: (value) => {
                              if (filter(getValues('env'), item => item.name === value).length > 1) {
                                return "There can be same env key";
                              }
                            }
                          }
                        }}
                      />
                      {
                        get(errors, `env.${index}.name.message`) &&
                        <div className={styles.error}>{get(errors, `env.${index}.name.message`)}</div>
                      }
                    </div>
                    <span className={styles.equal}>
                 =
                </span>
                    <div className={styles.right}>
                      <Controller
                        name={`env.${index}.value`}
                        control={control}
                        render={({field}) => (
                          <TextField
                            size="small"
                            sx={{...IconFocusStyle, width: '150px'}}
                            value={field.value}
                            onChange={field.onChange}
                          />
                        )}
                        rules={{required: 'Please input env value'}}
                      />
                      {
                        get(errors, `env.${index}.value.message`) &&
                        <div className={styles.error}>{get(errors, `env.${index}.value.message`)}</div>
                      }
                    </div>
                    <img src="/img/application/delete.svg" alt="" onClick={() => deployRemove(index)}
                         className={styles.deleteIcon}/>
                  </div>
                ))}
                <div className={styles.add} onClick={() => deployAppend({name: "", value: ''})}>
                  ADD ONE
                </div>
              </div>
            </div>
          }
          {
            getValues('isRepo') &&
            <div className={styles.item}>
              <div className={styles.label}></div>
              <div className={styles.content}>
                <ImportEnvByJson addEnvByJson={addEnvByJson}/>
                <ImportEnvFileByJson addEnvByJson={addEnvByJson}/>
              </div>
            </div>
          }
        </div>
      </form>
      <div className={styles.bottomBtn}>
        {
          (microList.length !== 1) &&
          <Button variant="outlined" onClick={cancel}>
            Cancel
          </Button>
        }
        <Button variant="contained" sx={{marginLeft: "20px"}} onClick={handleSubmit(submit)}>
          Confirm
        </Button>
      </div>
    </div>
  )
}
