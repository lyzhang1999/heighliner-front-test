import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, useRef, forwardRef, useEffect, useState} from "react";
import styles from "../FrontEnd/index.module.scss";
import {TextField, Switch, MenuItem, Select} from "@mui/material";
import clsx from "clsx";
import useStacks from "@/hooks/stacks";

const IconFocusStyle = {
  width: "100px",
  height: "36px",
  background: "#fff",
}

export interface Props {
  submitCb: () => void
}

const frontItem = [
  {
    img: "/img/application/gin.svg",
    name: 'Gin',
    key: "gin",
  },
  {
    img: "/img/application/spring.svg",
    name: 'Spring',
    key: "spring",
  },
  {
    img: "/img/application/node.svg",
    name: 'Express.js',
    key: "node",
  }
]

const FrontEnd = forwardRef(function frontEnd(props: Props, ref) {
  const {submitCb} = props;
  let [isStack, setIsStack] = useState<boolean>(true);

  const {register, control, handleSubmit, reset, trigger, setError} = useForm({
    defaultValues: {
      test: [{lastName: 'value'}],
      test2: [{key: '', value: ''}],
      frontend: '',
      reWrite: false,
      repo: '',
      enterFile: '',
      port: '',
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: "test"
  });

  const {fields: fields2, append: append2, remove: remove2} = useFieldArray({
    control,
    name: "test2"
  });

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(submit)()
    }
  }));

  function submit(value) {
    submitCb()
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className={styles.formItem}>
        <div className={styles.label}>
          Framework*
        </div>
        <div className={styles.content}>
          <Controller
            name={`frontend`}
            control={control}
            render={({field}) => (
              <div className={styles.selectWrapper}>
                {
                  frontItem.map(i => {
                    return (
                      <div key={i.name} className={clsx(styles.selectItem, styles.selected)}>
                        <img src={i.img} alt=""/>
                        <div className={styles.name}>{i.name}</div>
                      </div>
                    )
                  })
                }
              </div>
            )}
          />
        </div>
      </div>

      <div className={styles.selectTab}>
        <div className={clsx(styles.tab, isStack && styles.selected)}
             onClick={() => setIsStack(true)}
        >
          Scaffold by stack
        </div>
        <div className={clsx(styles.tab, !isStack && styles.selected)}
             onClick={() => setIsStack(false)}
        >
          Use existing repo
        </div>
      </div>
      <div className={styles.formWrapper}>
        {
          !isStack &&
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
          !isStack &&
          <div className={styles.item}>
            <div className={styles.label}>Enter to file:</div>
            <div className={styles.content}>
              <Controller
                name={`repo`}
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
          !isStack &&
          <div className={styles.item}>
            <div className={styles.label}>Port:</div>
            <div className={styles.content}>
              <Controller
                name={`repo`}
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
                  name={`test.${index}.lastName`}
                  control={control}
                  render={({field}) => (
                    <TextField
                      size="small"
                      sx={IconFocusStyle}
                      value={field.value}
                      // fullWidth
                      onChange={field.onChange}
                    />
                  )}
                />
                {
                  (fields.length > 1) &&
                  <img src="/img/application/delete.svg" alt="" onClick={() => remove(index)}
                       className={styles.deleteIcon}/>
                }
              </div>
            ))}
            <div className={styles.add} onClick={() => append({lastName: "luo"})}>
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
                  name={`test2.${index}.key`}
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
                  name={`test2.${index}.value`}
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
            <div className={styles.add} onClick={() => append2({key: "", value: ''})}>
              <span className={styles.addIcon}>+</span>
              <span className={styles.addDesc}>Add one</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
})

export default FrontEnd;
