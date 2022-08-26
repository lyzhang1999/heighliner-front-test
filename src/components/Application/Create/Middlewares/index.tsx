import {Controller, useForm, useFieldArray} from "react-hook-form";
import React, {useImperativeHandle, forwardRef, useEffect, useState} from "react";
import styles from "./index.module.scss";
import {TextField, Select, MenuItem} from "@mui/material";
import clsx from "clsx";
import {cloneDeep, find, findIndex, get, set, without} from "lodash-es";
import {FieldsMap, InitMiddleWareItem, MiddleWareType} from "@/components/Application/Create/util";
import {LinkMethod} from "@/pages/[organization]/applications/creation";
import MiddleDrawer, {PgTypes} from "@/components/Application/Create/Middlewares/MiddleDrawer";
import {FormStateType} from "@/pages/[organization]/applications/creation/context";

const IconFocusStyle = {}

const SelectStyle = {}

export interface Props {
  submitCb: Function,
  formState: FormStateType,
  stack: string
}

const webList = [
  'backend', 'frontend'
]

export const Middles = [
  {
    key: "postgres",
    name: 'Postgres'
  }
]

const Middlewares = forwardRef(function Component(props: Props, ref) {
  const {submitCb, formState, stack} = props;
  let {middleWares, selectAStack, microService} = formState;
  let {[FieldsMap.name]: name} = selectAStack;

  function getDefaultValue(): MiddleWareType {
    let defaultValue = cloneDeep(InitMiddleWareItem);
    set(defaultValue, 'otherValue.names.0.v', name.toLowerCase().replace(/-/g, '_'));
    return defaultValue;
  }

  const {control, handleSubmit, setValue, formState: {errors}, getValues, watch} = useForm({
    defaultValues: {
      middle: middleWares
    },
  });

  let [reload, setReload] = useState(null);
  let [modalDisplay, setModalDisplay] = useState<boolean>(false);
  let [editIndex, setEditIndex] = useState<number>();
  let [drawerInitState, setDrawerInitState] = useState<PgTypes | null>(null);

  // force reload the component, beceuse the select component can`t get new disable value
  useEffect(() => {
    setReload(null);
  }, [watch()])

  const {fields, append, remove} = useFieldArray({
    control,
    name: "middle"
  });

  function submit(value: { middle: MiddleWareType[] }) {
    submitCb("middleWares", value.middle)
  }

  function successCb(value: PgTypes) {
    setValue(`middle.${editIndex as number}.otherValue`, value)
  }

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
    submitCb('middleWares', getValues('middle'), true)
  }

  function getDisableValue(value: string, key: string, index: number) {
    let formData = getValues('middle');
    let thisItem = find(formData, {type: key});
    if (value === '') {
      return Boolean(thisItem);
    } else {
      if (Boolean(thisItem)) {
        let i = findIndex(formData, {type: key});
        if (i === index) {
          return false;
        } else {
          return true;
        }
      } else {
        return false;
      }
    }
  }

  return (
    <>
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
                          return <MenuItem value={item.key} key={item.key}
                                           disabled={getDisableValue(field.value, item.key, index)}
                          >{item.name}</MenuItem>
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
                      <Select
                        value={field.value}
                        onChange={field.onChange}
                        size="small"
                        multiple
                        sx={{width: "150px"}}
                      >
                        {
                          stack === 'micro' &&
                          (microService as any[]).map(item => {
                            return <MenuItem value={item.serviceName} key={item.serviceName}
                              // disabled={getDisableValue(field.value, item.key, index)}
                            >{item.serviceName}</MenuItem>
                          })
                        }
                        {
                          stack === 'web' &&
                          webList.map(item => {
                            return <MenuItem value={item} key={item}
                              // disabled={getDisableValue(field.value, item.key, index)}
                            >{item}</MenuItem>
                          })
                        }
                      </Select>

                      // <div className={styles.checkbox}>
                      //   <div className={clsx(styles.checkItem, value.includes('backend') && styles.selected)}
                      //        onClick={() => clickFrondendAndBackend('backend', field)}>
                      //     <span className={styles.icon}>√</span>
                      //     backend
                      //   </div>
                      //   <div className={clsx(styles.checkItem, value.includes('frontend') && styles.selected)}
                      //        onClick={() => clickFrondendAndBackend('frontend', field)}>
                      //     <span className={styles.icon}>√</span>
                      //     frontend
                      //   </div>
                      // </div>
                    )
                  }}
                  rules={{required: 'Please select injection'}}
                />
                {
                  get(errors, `middle.${index}.injection.message`, "") &&
                  <div className={styles.error}>{get(errors, `middle.${index}.injection.message`, "")}</div>
                }
                <img src="/img/application/editIcon.svg" alt="" onClick={() => {
                  setDrawerInitState(getValues(`middle.${index}.otherValue`) as PgTypes);
                  setEditIndex(index);
                  setModalDisplay(true)
                }} className={styles.editIcon}/>
                <img src="/img/application/delete.svg" alt="" onClick={() => remove(index)}
                     className={styles.deleteIcon}/>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.add} onClick={() => append(getDefaultValue())}>
          <span className={styles.addDesc}>ADD ONE</span>
        </div>

      </form>
      {
        modalDisplay &&
        <MiddleDrawer{...{
          setModalDisplay,
          modalDisplay,
          successCb,
          drawerInitState
        }}/>
      }
    </>
  );
})

export default Middlewares;
