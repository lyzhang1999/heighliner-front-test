import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, useRef, forwardRef} from "react";
import styles from "./index.module.scss";
import {TextField} from "@mui/material";

const IconFocusStyle = {
  width: "200px",
  height: "36px",
}

export interface Props {
  submitCb: () => void
}

const Middlewares = forwardRef(function frontEnd(props: Props, ref) {
  const {submitCb} = props;
  const {register, control, handleSubmit, reset, trigger, setError} = useForm({
    defaultValues: {
      test: [{lastName: 'value'}],
      test2: [{key: '', value: ''}]
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
      <div className={styles.item}>
        <div className={styles.label}>Env Variables::</div>
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
    </form>
  );
})

export default Middlewares;
