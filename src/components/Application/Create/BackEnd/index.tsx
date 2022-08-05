import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, forwardRef, useState} from "react";
import styles from "../FrontEnd/index.module.scss";
import {TextField, Switch, MenuItem, Select} from "@mui/material";
import clsx from "clsx";
import {FormStateType, LinkMethod} from "@/pages/[organization]/applications/creation";
import {get, set, filter} from "lodash-es";
import {pathRule, portRule, entryPathRule} from "@/utils/formRules";
import {getRepoListRes} from "@/api/application";
import {EnvType, FrameItemType, FrameworkType} from "@/components/Application/Create/util";
import ImportEnvByJson from "@/components/ImportEnvByJson";
import {CommonProps} from "@/utils/commonType";

const widhtSx = {width: "250px"};

export const IconFocusStyle = {
  background: '#fff',
  borderRadius: '4px',
  ...widhtSx
}

export interface Props {
  submitCb: Function,
  formState: FormStateType,
  repoList: getRepoListRes[]
}

export const backItem: FrameItemType[] = [
  {
    img: "/img/application/gin.svg",
    name: 'Gin',
    key: "gin",
    version: "1.7.7",
    language: 'golang',
    languageVersion: '1.18',
  },
  // {
  //   img: "/img/application/spring.svg",
  //   name: 'Spring',
  //   key: "spring",
  // },
  // {
  //   img: "/img/application/node.svg",
  //   name: 'Express.js',
  //   key: "node",
  // }
]

const Backend = forwardRef(function Component(props: Props, ref) {
  const {submitCb, formState, repoList} = props;
  let {backend, frontend} = formState;
  let {isRepo: repo, framework, repo_url, env, exposePort, path, rewrite, entryFile} = backend;
  let [isRepo, setIsRepo] = useState<boolean>(repo);

  const {control, handleSubmit, formState: {errors}, getValues} = useForm({
    defaultValues: {
      path: path,
      env: env,
      rewrite: rewrite,
      repo_url: repo_url,
      entryFile: entryFile,
      exposePort: exposePort,
      framework: framework,
      isRepo: repo
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: "path"
  });

  const {fields: envFields, append: envAppend, remove: envRemove} = useFieldArray({
    control,
    name: "env"
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
    submitCb('backend', value, true)
  }

  function submit(value: FrameworkType) {
    set(value, 'isRepo', isRepo);
    submitCb('backend', value)
  }

  function addEnvByJson(obj: EnvType[]) {
    envAppend(obj);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className={styles.formItem}>
        <div className={styles.label}>
          Framework*
        </div>
        <div className={styles.content}>
          <Controller
            name={`framework`}
            control={control}
            render={({field}) => (
              <div className={styles.selectWrapper}>
                {
                  backItem.map(i => {
                    return (
                      <div key={i.name} className={clsx(styles.selectItem, (field.value === i.key) && styles.selected)}
                           onClick={() => {
                             field.onChange(i.key)
                           }}
                      >
                        <img src={i.img} alt=""/>
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
                      repoList.map(item => {
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
            <div className={styles.label}>Entry file*</div>
            <div className={styles.content}>
              <Controller
                name={`entryFile`}
                control={control}
                render={({field}) => (
                  <TextField
                    size="small"
                    sx={IconFocusStyle}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
                rules={entryPathRule}
              />
              {
                errors.entryFile?.message &&
                <div className={styles.error}>{errors.entryFile?.message}</div>
              }
            </div>
          </div>
        }
        {
          isRepo &&
          <div className={styles.item}>
            <div className={styles.label}>Port*</div>
            <div className={styles.content}>
              <Controller
                name={`exposePort`}
                control={control}
                render={({field}) => (
                  <TextField
                    size="small"
                    sx={IconFocusStyle}
                    value={field.value}
                    onChange={field.onChange}
                  />
                )}
                rules={portRule}
              />
              {
                errors.exposePort?.message &&
                <div className={styles.error}>{errors.exposePort?.message}</div>
              }
            </div>
          </div>
        }

        <div className={styles.item}>
          <div className={styles.label}>HTTP Routes*</div>
          <div className={styles.content}>
            {fields.map((item, index) => (
              <div key={item.id} className={styles.inputItem}>
                <div className={styles.left}>
                  <Controller
                    name={`path.${index}.v`}
                    control={control}
                    render={({field}) => (
                      <TextField
                        size="small"
                        sx={IconFocusStyle}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                    rules={{
                      ...pathRule,
                      validate: {
                        unconformity: (value) => {
                          if ((
                            filter(getValues('path'), item => item.v === value).length +
                            filter(frontend.path, item => item.v === value).length
                          ) > 1) {
                            return "There can be same values";
                          }
                        }
                      }
                    }}
                  />
                  {
                    get(errors, `path.${index}.v.message`) &&
                    <div className={styles.error}>{get(errors, `path.${index}.v.message`)}</div>
                  }
                </div>
                {
                  (fields.length > 1) &&
                  <img src="/img/application/delete.svg" alt="" onClick={() => remove(index)}
                       className={styles.deleteIcon}/>
                }
              </div>
            ))}
            <div className={styles.add} onClick={() => append({v: ''})}>
              ADD ONE
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>Path Rewrite</div>
          <div className={styles.content}>
            <Controller
              name={`rewrite`}
              control={control}
              render={({field}) => (
                <Switch checked={field.value} onChange={field.onChange} />
              )}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>Env Variables</div>
          <div className={styles.content}>
            {envFields.map((item, index) => (
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
                <img src="/img/application/delete.svg" alt="" onClick={() => envRemove(index)}
                     className={styles.deleteIcon}/>
              </div>
            ))}
            <div className={styles.add} onClick={() => envAppend({name: "", value: ''})}>
              ADD ONE
            </div>
            <ImportEnvByJson addEnvByJson={addEnvByJson}/>
          </div>
        </div>
      </div>
    </form>
  );
})

export default Backend;
