import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, useRef, forwardRef, useEffect, useState} from "react";
import styles from "./index.module.scss";
import {TextField, Switch, MenuItem, Select} from "@mui/material";
import clsx from "clsx";
import {FormStateType} from "@/pages/[organization]/applications/create";
import {get, isEmpty, set} from "lodash-es";
import {pathRule, portRule} from "@/utils/formRules";

const widhtSx = {width: "250px"};

export const IconFocusStyle = {
  background: '#fff',
  borderRadius: '4px',
  ...widhtSx
}

export interface Props {
  submitCb: (key: string, value: object) => void,
  formState: FormStateType,
}

const frontItem = [
  // {
  //   img: "/img/application/vue.svg",
  //   name: 'Vue.js',
  //   key: "vue",
  // },
  {
    img: "/img/application/next.svg",
    name: 'Next.js',
    key: "next",
    version: "1.7.7"
  },
  // {
  //   img: "/img/application/react.svg",
  //   name: 'React.js',
  //   key: "react",
  // }
]

const Frontend = forwardRef(function frontEnd(props: Props, ref) {
  const {submitCb, formState, repoList} = props;
  let {frontend} = formState;
  let {isRepo: repo, framework, repo_url, env, exposePort, path, rewrite, entryFile} = frontend;
  let [isRepo, setIsRepo] = useState<boolean>(repo);

  const {control, handleSubmit, formState: {errors},} = useForm({
    defaultValues: {
      path: path,
      env: env,
      rewrite: rewrite,
      repo_url: repo_url,
      entryFile: entryFile,
      exposePort: exposePort,
      framework: framework
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
    submit: () => handleSubmit(submit)()
  }));

  function submit(value) {
    console.warn(value)
    submitCb('frontend', value)
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
                  frontItem.map(i => {
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
            <div className={styles.label}>Enter to file*</div>
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
                rules={pathRule}
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
          <div className={styles.label}>Exposure Path*</div>
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
                    rules={pathRule}
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
                <Switch value={field.value} onChange={field.onChange}/>
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
                    rules={{required: 'Please input env name'}}
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
          </div>
        </div>
      </div>
    </form>
  );
})

export default Frontend;
