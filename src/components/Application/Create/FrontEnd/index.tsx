import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, forwardRef, useState, useEffect} from "react";
import styles from "./index.module.scss";
import {TextField, Switch, MenuItem, Select} from "@mui/material";
import clsx from "clsx";
import {FormStateType, LinkMethod} from "@/pages/[organization]/applications/creation";
import {filter, get, set, trim} from "lodash-es";
import {entryPathRule, pathRule, portRule} from "@/utils/formRules";
import {getRepoListRes} from "@/api/application";
import {EnvType, FrameItemType, FrontendItemType, FrontendType} from "@/components/Application/Create/util";
import ImportEnvByJson from "@/components/ImportEnvByJson";
import ImportEnvFileByJson from "@/components/ImportEnvFileByJson";

const widhtSx = {width: "250px"};

export const IconFocusStyle = {
  background: '#fff',
  borderRadius: '4px',
  ...widhtSx
}

export interface Props {
  submitCb: (key: string, value: object, flag?: boolean) => void,
  formState: FormStateType,
  repoList: getRepoListRes[] | boolean
}

export const frontItem: FrontendItemType[] = [
  {
    img: "/img/application/next.svg",
    name: 'Next.js',
    key: "nextjs",
    version: "1.7.7",
    language: 'typescript',
    languageVersion: '1.7.7',

    buildCommand: 'yarn install && yarn build',
    outputDir: '/',
    buildEnv: [],
    deployMode: 'command',
    runCommand: "yarn start",
    port: '3000',
    deployEnv: [],
    staticDeployMode: 'mpa',
    path404: '/404.html'
  },
  {
    img: "/img/application/create/vite.svg",
    name: 'Vite',
    key: "vue-vite",
    version: "1.7.7",
    language: 'typescript',
    languageVersion: '1.7.7',

    buildCommand: 'yarn install && yarn build',
    outputDir: '/dist',
    buildEnv: [],
    deployMode: 'static',
    runCommand: "",
    port: '',
    deployEnv: [],
    staticDeployMode: 'spa',
    path404: '/404.html'
  },
  {
    img: "/img/application/vue.svg",
    name: 'Vue-Cli',
    key: "vue-cli",
    version: "1.7.7",
    language: 'typescript',
    languageVersion: '1.7.7',

    buildCommand: 'yarn install && yarn build',
    outputDir: '/dist',
    buildEnv: [],
    deployMode: 'static',
    runCommand: "",
    port: '',
    deployEnv: [],
    staticDeployMode: 'spa',
    path404: '/404.html'
  },
  {
    img: "/img/application/create/create-react-app.svg",
    name: 'React-App',
    key: "react-cli",
    version: "1.7.7",
    language: 'typescript',
    languageVersion: '1.7.7',

    buildCommand: 'yarn install && yarn build',
    outputDir: '/build',
    buildEnv: [],
    deployMode: 'static',
    runCommand: "",
    port: '',
    deployEnv: [],
    staticDeployMode: 'spa',
    path404: '/404.html'
  },
]

export const DeplodModeList = [
  {
    key: 'static',
    value: 'Static Site'
  },
  {
    key: 'command',
    value: 'Deploy By Command'
  }
]

export const StaticDeployModeList = [
  {
    key: 'spa',
    value: "Single Page App"
  },
  {
    key: 'mpa',
    value: "Multi Page App"
  }
]

const Frontend = forwardRef(function Component(props: Props, ref) {
  const {submitCb, formState, repoList} = props;
  let {frontend} = formState;
  let {
    isRepo: repo, framework, repo_url, env, exposePort, path, rewrite, entryFile,
    buildCommand,
    outputDir,
    buildEnv,
    deployMode,
    runCommand,
    port,
    deployEnv,
    staticDeployMode,
    path404,
    name
  } = frontend;
  let [isRepo, setIsRepo] = useState<boolean>(repo);
  let [reload, setReload] = useState(null);

  const {control, handleSubmit, formState: {errors}, getValues, watch} = useForm({
    defaultValues: {
      path: path,
      env: env,
      rewrite: rewrite,
      repo_url: repo_url,
      entryFile: entryFile,
      exposePort: exposePort,
      framework: framework,
      isRepo: repo,

      buildCommand,
      outputDir,
      buildEnv,
      deployMode,
      runCommand,
      port,
      deployEnv,
      staticDeployMode,
      path404,
      name,
    },
  });

  useEffect(() => {
    setReload(null);
  }, [watch()])

  const {fields, append, remove} = useFieldArray({
    control,
    name: "path"
  });

  const {fields: envFields, append: envAppend, remove: envRemove} = useFieldArray({
    control,
    name: "buildEnv"
  });

  const {fields: deployFields, append: deployAppend, remove: deployRemove} = useFieldArray({
    control,
    name: "deployEnv"
  });

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
    let value = getValues();
    set(value, 'isRepo', isRepo);
    submitCb('frontend', value, true)
  }

  function submit(value: FrontendType) {
    set(value, 'isRepo', isRepo);
    submitCb('frontend', value)
  }

  function addEnvByJson(obj: EnvType[]) {
    envAppend(obj);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className={styles.selectTab}>
        <div className={clsx(styles.tab, !isRepo && styles.selected)}
             onClick={() => setIsRepo(false)}
        >
          Scaffold by stack
        </div>
        <div className={clsx(styles.tab, isRepo && styles.selected)}
             onClick={() => setIsRepo(true)}
        >
          Use existing repo
        </div>
      </div>
      <div className={styles.formWrapper}>
        {
          !isRepo &&
          <div className={styles.content}>
            <Controller
              name={`framework`}
              control={control}
              render={({field}) => (
                <div className={styles.selectWrapper}>
                  {
                    frontItem.map(i => {
                      return (
                        <div key={i.name}
                             className={clsx(styles.selectItem, (field.value === i.key) && styles.selected)}
                             onClick={() => {
                               field.onChange(i.key)
                             }}
                        >
                          <img src={i.img} alt="" style={{width: '40px', height: '40px'}}/>
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
        }
        {
          !isRepo &&
          <div className={styles.item}>
            <div className={styles.label}>Repo Name*</div>
            <div className={styles.content}>
              <Controller
                name={`name`}
                control={control}
                render={({field}) => (
                  <TextField
                    size="small"
                    sx={IconFocusStyle}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="frontend-repo-name"
                  />
                )}
                rules={{
                  required: "Please input repo name",
                  validate: {
                    illegalCharacter: (value) =>
                      !/[^a-z0-9-]/.test(value) ||
                      "The name should only contain lowercase alphanumeric character, or hyphen(-).",
                    illegalStart: (value) =>
                      /^[a-z]/.test(value) ||
                      "The name should start with lowercase letter character.",
                    illegalEnd: (value) =>
                      /[a-z0-9]$/.test(value) ||
                      "Then name should end with lowercase alphanumeric character.",
                  },
                  maxLength: {
                    value: 63,
                    message: "The max length is 63 character.",
                  },
                }}
              />
              {
                errors.name?.message &&
                <div className={styles.error}>{errors.name?.message}</div>
              }
            </div>
          </div>
        }
        {
          isRepo &&
          <div className={styles.item}>
            <div className={styles.label}>Repository*</div>
            <div className={styles.content}>
              <Controller
                name={`repo_url`}
                control={control}
                render={({field}) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                    sx={{background: "#fff", width: "250px"}}
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
                errors.repo_url?.message &&
                <div className={styles.error}>{errors.repo_url?.message}</div>
              }
            </div>
          </div>
        }
        {
          isRepo &&
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
                    placeholder="yarn install && yarn build"
                  />
                )}
                // rules={{required: "Please Input Build Command"}}
              />
              {
                errors.buildCommand?.message &&
                <div className={styles.error}>{errors.buildCommand?.message}</div>
              }
            </div>
          </div>
        }
        {
          isRepo &&
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
                    placeholder="dist"
                  />
                )}
                // rules={{
                // }}
              />
              {
                errors.outputDir?.message &&
                <div className={styles.error}>{errors.outputDir?.message}</div>
              }
            </div>
          </div>
        }
        {/*{*/}
        {/*  isRepo &&*/}
        {/*  <div className={styles.item}>*/}
        {/*    <div className={styles.label}>Env Variables</div>*/}
        {/*    <div className={styles.content}>*/}
        {/*      {envFields.map((item, index) => (*/}
        {/*        <div key={item.id} className={styles.inputItem}>*/}
        {/*          <div className={styles.left}>*/}
        {/*            <Controller*/}
        {/*              name={`buildEnv.${index}.name`}*/}
        {/*              control={control}*/}
        {/*              render={({field}) => (*/}
        {/*                <TextField*/}
        {/*                  size="small"*/}
        {/*                  sx={{...IconFocusStyle, width: '150px'}}*/}
        {/*                  value={field.value}*/}
        {/*                  onChange={field.onChange}*/}
        {/*                />*/}
        {/*              )}*/}
        {/*              rules={{*/}
        {/*                required: 'Please input env name',*/}
        {/*                validate: {*/}
        {/*                  unconformity: (value) => {*/}
        {/*                    if (filter(getValues('buildEnv'), item => item.name === value).length > 1) {*/}
        {/*                      return "There can be same env key";*/}
        {/*                    }*/}
        {/*                  }*/}
        {/*                }*/}
        {/*              }}*/}
        {/*            />*/}
        {/*            {*/}
        {/*              get(errors, `buildEnv.${index}.name.message`) &&*/}
        {/*              <div className={styles.error}>{get(errors, `buildEnv.${index}.name.message`)}</div>*/}
        {/*            }*/}
        {/*          </div>*/}
        {/*          <span className={styles.equal}>*/}
        {/*         =*/}
        {/*        </span>*/}
        {/*          <div className={styles.right}>*/}
        {/*            <Controller*/}
        {/*              name={`buildEnv.${index}.value`}*/}
        {/*              control={control}*/}
        {/*              render={({field}) => (*/}
        {/*                <TextField*/}
        {/*                  size="small"*/}
        {/*                  sx={{...IconFocusStyle, width: '150px'}}*/}
        {/*                  value={field.value}*/}
        {/*                  onChange={field.onChange}*/}
        {/*                />*/}
        {/*              )}*/}
        {/*              rules={{required: 'Please input env value'}}*/}
        {/*            />*/}
        {/*            {*/}
        {/*              get(errors, `buildEnv.${index}.value.message`) &&*/}
        {/*              <div className={styles.error}>{get(errors, `buildEnv.${index}.value.message`)}</div>*/}
        {/*            }*/}
        {/*          </div>*/}
        {/*          <img src="/img/application/delete.svg" alt="" onClick={() => envRemove(index)}*/}
        {/*               className={styles.deleteIcon}/>*/}
        {/*        </div>*/}
        {/*      ))}*/}
        {/*      <div className={styles.add} onClick={() => envAppend({name: "", value: ''})}>*/}
        {/*        ADD ONE*/}
        {/*      </div>*/}
        {/*      /!*<ImportEnvByJson addEnvByJson={addEnvByJson}/>*!/*/}
        {/*    </div>*/}
        {/*  </div>*/}
        {/*}*/}

        {
          isRepo &&
          <div className={styles.item}>
            <div className={styles.label}>Deploy Mode*</div>
            <div className={styles.content}>
              <Controller
                name={`deployMode`}
                control={control}
                render={({field}) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                    sx={{background: "#fff", width: "250px"}}
                  >
                    {
                      DeplodModeList.map(item => {
                        return (
                          <MenuItem value={item.key} key={item.key}>{item.value}</MenuItem>
                        )
                      })
                    }
                  </Select>
                )}
                rules={{
                  required: "Please select deploy mode",
                }}
              />
              {
                errors.deployMode?.message &&
                <div className={styles.error}>{errors.deployMode?.message}</div>
              }
            </div>
          </div>
        }

        {
          isRepo && (getValues('deployMode') === 'command') &&
          <div className={styles.item}>
            <div className={styles.label}>Run Command*</div>
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
                    placeholder="yarn start"
                  />
                )}
                rules={{required: "Please input deploy command"}}
              />
              {
                errors.runCommand?.message &&
                <div className={styles.error}>{errors.runCommand?.message}</div>
              }
            </div>
          </div>
        }
        {
          isRepo && (getValues('deployMode') === 'command') &&
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
                    placeholder="3000"
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
          isRepo && (getValues('deployMode') === 'command') &&
          <div className={styles.item}>
            <div className={styles.label}>Env Variables</div>
            <div className={styles.content}>
              {deployFields.map((item, index) => (
                <div key={item.id} className={styles.inputItem}>
                  <div className={styles.left}>
                    <Controller
                      name={`deployEnv.${index}.name`}
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
                            if (filter(getValues('deployEnv'), item => item.name === value).length > 1) {
                              return "There can be same env key";
                            }
                          }
                        }
                      }}
                    />
                    {
                      get(errors, `deployEnv.${index}.name.message`) &&
                      <div className={styles.error}>{get(errors, `deployEnv.${index}.name.message`)}</div>
                    }
                  </div>
                  <span className={styles.equal}>
                 =
                </span>
                  <div className={styles.right}>
                    <Controller
                      name={`deployEnv.${index}.value`}
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
                      get(errors, `deployEnv.${index}.value.message`) &&
                      <div className={styles.error}>{get(errors, `deployEnv.${index}.value.message`)}</div>
                    }
                  </div>
                  <img src="/img/application/delete.svg" alt="" onClick={() => deployRemove(index)}
                       className={styles.deleteIcon}/>
                </div>
              ))}
              <div className={styles.add} onClick={() => deployAppend({name: "", value: ''})}>
                ADD ONE
              </div>
              {/*<ImportEnvByJson addEnvByJson={addEnvByJson}/>*/}
            </div>
            <ImportEnvByJson addEnvByJson={addEnvByJson} />
            <ImportEnvFileByJson addEnvByJson={addEnvByJson}/>
          </div>
        }
        {
          isRepo && (getValues('deployMode') === 'static') &&
          <div className={styles.item}>
            <div className={styles.label}>Static Type*</div>
            <div className={styles.content}>
              <Controller
                name={`staticDeployMode`}
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
                  required: "Please select static deploy mode",
                }}
              />
              {
                errors.staticDeployMode?.message &&
                <div className={styles.error}>{errors.staticDeployMode?.message}</div>
              }
            </div>
          </div>
        }

        {
          isRepo && (getValues('staticDeployMode') === 'mpa') && (getValues('deployMode') === 'static') &&
          <div className={styles.item}>
            <div className={styles.label}>404 Path*</div>
            <div className={styles.content}>
              <Controller
                name={`path404`}
                control={control}
                render={({field}) => (
                  <TextField
                    size="small"
                    sx={IconFocusStyle}
                    value={field.value}
                    onChange={field.onChange}
                    placeholder="/404.html"
                  />
                )}
                rules={{...pathRule, required: "Please input 404 path"}}
              />
              {
                errors.path404?.message &&
                <div className={styles.error}>{errors.path404?.message}</div>
              }
            </div>
          </div>
        }
      </div>
    </form>
  );
})

export default Frontend;
