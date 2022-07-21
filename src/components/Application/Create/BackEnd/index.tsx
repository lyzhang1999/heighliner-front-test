import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, useRef, forwardRef, useEffect, useState} from "react";
import styles from "../FrontEnd/index.module.scss";
import {TextField, Switch, MenuItem, Select} from "@mui/material";
import clsx from "clsx";
import useStacks from "@/hooks/stacks";
import {FormStateType} from "@/pages/[organization]/applications/create";
import {isEmpty} from "lodash-es";
import {getTheRepoList} from "@/api/application";

const IconFocusStyle = {
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
  const {submitCb, formState, gitObj} = props;
  let {backend} = formState;
  let {isRepo: repo, framework, repo_url, env, exposePort, path, rewrite, entryFile} = backend;
  let [isRepo, setIsRepo] = useState<boolean>(repo);

  const [repoList, setRepoList] = useState([]);

  useEffect(() => {
    getTheRepoList(gitObj).then(res => {
      setRepoList(res);
      console.warn(res)
    })
  }, [])

  const {register, control, handleSubmit, formState: {errors},} = useForm({
    defaultValues: {
      path: [{v: ''}],
      env: [{name: '', value: ''}],
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

  const {fields: fields2, append: append2, remove: remove2} = useFieldArray({
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
      {JSON.stringify(errors)}
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
              required: "Please choose a framework.",
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
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                )}
              />
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
              />
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
              />
            </div>
          </div>
        }

        <div className={styles.item}>
          <div className={styles.label}>Exposure Path:</div>
          <div className={styles.content}>
            {fields.map((item, index) => (
              <div key={item.id} className={styles.inputItem}>
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
                />
                <img src="/img/application/delete.svg" alt="" onClick={() => remove(index)}
                     className={styles.deleteIcon}/>
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
            {fields2.map((item, index) => (
              <div key={item.id} className={styles.inputItem}>
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
                />
                <span className={styles.equal}>
                 =
              </span>
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
                />
                {
                  (fields2.length > 1) &&
                  <img src="/img/application/delete.svg" alt="" onClick={() => remove2(index)}
                       className={styles.deleteIcon}/>
                }
              </div>
            ))}
            <div className={styles.add} onClick={() => append2({name: "", value: ''})}>
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
