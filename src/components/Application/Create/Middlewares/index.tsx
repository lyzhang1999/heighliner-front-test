import {Controller, useForm, useFieldArray, ControllerProps} from "react-hook-form";
import React, {useImperativeHandle, useRef, forwardRef} from "react";
import styles from "./index.module.scss";
import {TextField, Select, MenuItem} from "@mui/material";
import clsx from "clsx";
import {get, without} from "lodash-es";
import {InitMiddleWareItem} from "@/pages/[organization]/applications/creation/util";
import {FormStateType} from "@/pages/[organization]/applications/creation";

const IconFocusStyle = {}

const SelectStyle = {}

export interface Props {
  submitCb: (key: string, value: object) => void,
  formState: FormStateType,
}

export const Middles = [
  {
    key: "postgres",
    name: 'Postgres'
  }
]

const Middlewares = forwardRef(function frontEnd(props: Props, ref) {
  const {submitCb, formState, repoList} = props;
  let {middleWares} = formState;

  const {control, handleSubmit, setValue, formState: {errors}} = useForm({
    defaultValues: {
      middle: middleWares
    },
  });

  const {fields, append, remove} = useFieldArray({
    control,
    name: "middle"
  });

  useImperativeHandle(ref, () => ({
    submit: () => handleSubmit(submit)()
  }));

  function submit(value) {
    submitCb("middleWares", value.middle)
  }

  function clickFrondendAndBackend(key: string, filed: ControllerProps) {
    let {value, name} = filed;
    if (value.includes(key)) {
      value = without(value, key)
    } else {
      value.push(key)
    }
    console.warn(name, value)
    setValue(name, value);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className={clsx(styles.header, styles.inputItem)}>
        <div className={styles.left}>Name</div>
        <div className={styles.center}>Type</div>
        <div className={styles.line}></div>

        <div className={styles.right}>Connection info injection</div>
      </div>
      <div className={styles.item}>
        {fields.map((item, index) => (
          <div key={item.id} className={styles.inputItem}>
            <div className={styles.left}>
              <Controller
                name={`middle.${index}.name`}
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
                rules={{required: 'Please input name'}}
              />
              {
                get(errors, `middle.${index}.name.message`) &&
                <div className={styles.error}>{get(errors, `middle.${index}.name.message`)}</div>
              }
            </div>
            <div className={styles.center}>
              <Controller
                name={`middle.${index}.type`}
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
                      Middles.map(item => {
                        return <MenuItem value={item.key} key={item.key}>{item.name}</MenuItem>
                      })
                    }
                  </Select>
                )}
                rules={{required: 'Please select a middleware'}}
              />
              {
                get(errors, `middle.${index}.type.message`) &&
                <div className={styles.error}>{get(errors, `middle.${index}.type.message`)}</div>
              }
            </div>
            <div className={styles.line}></div>
            <div className={styles.right}>
              <Controller
                name={`middle.${index}.injection`}
                control={control}
                render={({field}) => {
                  let {value} = field;
                  return (
                    <div className={styles.checkbox}>
                      <div className={clsx(styles.checkItem, value.includes('backend') && styles.selected)}
                           onClick={() => clickFrondendAndBackend('backend', field)}>
                        <span className={styles.icon}>√</span>
                        backend
                      </div>
                      <div className={clsx(styles.checkItem, value.includes('frontend') && styles.selected)}
                           onClick={() => clickFrondendAndBackend('frontend', field)}>
                        <span className={styles.icon}>√</span>
                        frontend
                      </div>
                    </div>
                  )
                }}
                rules={{required: 'Please select injection'}}
              />
              {
                get(errors, `middle.${index}.injection.message`, "") &&
                <div className={styles.error}>{get(errors, `middle.${index}.injection.message`, "")}</div>
              }
              <img src="/img/application/delete.svg" alt="" onClick={() => remove(index)}
                   className={styles.deleteIcon}/>
            </div>
            {/*<img src="/img/application/editIcon.svg" alt="" onClick={() => (index)}*/}
            {/*     className={styles.deleteIcon}/>*/}
            {/*{*/}
            {/*  (fields.length > 1) &&*/}

            {/*}*/}
          </div>
        ))}
      </div>
      <div className={styles.add} onClick={() => append(InitMiddleWareItem)}>
        <span className={styles.addDesc}>ADD ONE</span>
      </div>
    </form>
  );
})

export default Middlewares;
