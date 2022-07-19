import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, useRef, forwardRef} from "react";
import styles from "./index.module.scss";
import {TextField} from "@mui/material";

const IconFocusStyle = {
  width: "200px",
  height: "36px",
}

interface Props {
  ref: any
}

const FrontEnd = forwardRef(function frontEnd(props, ref) {
  const {setIndex, nextIndex, submitCb} = props;
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

  const inputRef: React.MutableRefObject<null> = useRef(null);

  useImperativeHandle(ref, () => ({
    submit: () => {
      inputRef.current.click();
    }
  }));

  function submit(value) {
    console.warn(value)
    submitCb()
  }

  return (
    <form onSubmit={handleSubmit(submit)}>
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
      <input type="submit" ref={inputRef}/>
    </form>
  );
})

export default FrontEnd;
