import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, useRef, forwardRef, useEffect, useState} from "react";
import styles from "../FrontEnd/index.module.scss";
import {TextField, Switch, MenuItem, Select} from "@mui/material";
import clsx from "clsx";
import {FormStateType} from "@/pages/[organization]/applications/create";
import {get, isEmpty} from "lodash-es";
import {pathRule, portRule} from "@/utils/formRules";

export const IconFocusStyle = {
  width: "100px",
  background: '#fff',
  borderRadius: '4px',
}

export interface Props {
  submitCb: (key: string, value: object) => void,
  formState: FormStateType,
}

const frontItem = [
  {
    img: "/img/application/gin.svg",
    name: 'Gin',
    key: "gin",
    version: "1.7.7"
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

const Backend = forwardRef(function frontEnd(props: Props, ref) {
  const {submitCb, formState, repoList} = props;
  let {backend} = formState;
  let {isRepo: repo, framework, repo_url, env, exposePort, path, rewrite, entryFile} = backend;
  let [isRepo, setIsRepo] = useState<boolean>(repo);

  const {control, handleSubmit, formState: {errors},} = useForm({
    defaultValues: {
      path: [{v: ''}],
      env: [],
      frontend: '',
      reWrite: rewrite,
      repo: '',
      enterFile: '',
      port: '',
      framework: ''
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
    submitCb('backend', value)
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
            <div className={styles.label}>Repository*:</div>
            <div className={styles.content}>
              <Controller
                name={`repo`}
                control={control}
                render={({field}) => (
                  <Select
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                    sx={{width: "200px", background: "#fff"}}
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
                errors.repo?.message &&
                <div className={styles.error}>{errors.repo?.message}</div>
              }
            </div>
          </div>
        }
        {
          isRepo &&
          <div className={styles.item}>
            <div className={styles.label}>Enter to file:</div>
            <div className={styles.content}>
              <Controller
                name={`enterFile`}
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
                errors.enterFile?.message &&
                <div className={styles.error}>{errors.enterFile?.message}</div>
              }
            </div>
          </div>
        }
        {
          isRepo &&
          <div className={styles.item}>
            <div className={styles.label}>Port:</div>
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

        <div className={styles.item}>
          <div className={styles.label}>Exposure Path:</div>
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
              <span className={styles.addIcon}>+</span>
              <span className={styles.addDesc}>Add one</span>
            </div>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>Path Rewrite:</div>
          <div className={styles.content}>
            <Controller
              name={`reWrite`}
              control={control}
              render={({field}) => (
                <Switch value={field.value} onChange={field.onChange}/>
              )}
            />
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>Env Variables:</div>
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
                        sx={IconFocusStyle}
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
                        sx={IconFocusStyle}
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
              <span className={styles.addIcon}>+</span>
              <span className={styles.addDesc}>Add one</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
})

export default Backend;
