import {Controller, useForm, useFieldArray, ControllerProps} from "react-hook-form";
import React, {useImperativeHandle, useRef, forwardRef} from "react";
import styles from "./index.module.scss";
import {TextField, Select, MenuItem} from "@mui/material";
import clsx from "clsx";
import {omit, without} from "lodash-es";

const IconFocusStyle = {
  width: "115px",
  // height: "36px",
  marginRight: '16px'
}

const SelectStyle = {
  // marginRight: '30px'
  width: '184px'
}

export interface Props {
  submitCb: () => void
}

const Middlewares = forwardRef(function frontEnd(props: Props, ref) {
  const {submitCb} = props;
  const {register, control, handleSubmit, reset, trigger, setError, setValue} = useForm({
    defaultValues: {
      test: [{lastName: 'value'}],
      test2: [{key: '', value: '', box: ["backend"]}]
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

  function clickFrondendAndBackend(key: string, filed: ControllerProps) {
    let {value, name} = filed;
    if (value.includes(key)) {
      value = without(value, key)
    } else {
      value.push(key)
    }
    setValue(name, value);
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
      <div className={styles.item}>
        {/*<div className={styles.label}>Env Variables::</div>*/}
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
              <Controller
                name={`test2.${index}.value`}
                control={control}
                render={({field}) => (
                  <Select
                    id="demo-simple-select"
                    value={field.value}
                    onChange={field.onChange}
                    size="small"
                    sx={SelectStyle}
                  >
                    <MenuItem value={10}>Ten</MenuItem>
                    <MenuItem value={20}>Twenty</MenuItem>
                    <MenuItem value={30}>Thirty</MenuItem>
                  </Select>
                )}
              />
              <div className={styles.line}></div>
              <Controller
                name={`test2.${index}.box`}
                control={control}
                render={({field}) => {
                  console.warn(field);
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
              />
              <img src="/img/application/editIcon.svg" alt="" onClick={() => (index)}
                   className={styles.deleteIcon}/>
              {
                (fields2.length > 1) &&
                <img src="/img/application/delete.svg" alt="" onClick={() => remove2(index)}
                     className={styles.deleteIcon}/>
              }
            </div>
          ))}
          <div className={styles.add} onClick={() => append2({key: "", value: '', box: []})}>
            <span className={styles.addIcon}>+</span>
            <span className={styles.addDesc}>Add one</span>
          </div>
        </div>
      </div>
    </form>
  );
})

export default Middlewares;
