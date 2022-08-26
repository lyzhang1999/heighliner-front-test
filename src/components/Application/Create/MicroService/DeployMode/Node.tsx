import {filter, functions, get} from "lodash-es";
// import styles from "@/components/Application/Create/FrontEnd/index.module.scss";
import {Controller} from "react-hook-form";
import {MenuItem, Select, TextField} from "@mui/material";
import {getRepoListRes} from "@/api/application";
import React, {useEffect, useState} from "react";
import {DeplodModeList, IconFocusStyle, StaticDeployModeList} from "@/components/Application/Create/FrontEnd";
import {pathRule, portRule} from "@/utils/formRules";
import styles from "../serviceItem.module.scss";
import ImportEnvByJson from "@/components/ImportEnvByJson";
import ImportEnvFileByJson from "@/components/ImportEnvFileByJson";
import {EnvType} from "@/components/Application/Create/util";

interface Props {
  getValues: any,
  control: any,
  errors: any,
  watch: any,
  deployFields: any,
  deployAppend: any,
  deployRemove: any
}


export default function Node({getValues, control, errors, watch, deployFields, deployAppend, deployRemove}: Props) {
  const [render, setRender] = useState<null>(null);

  useEffect(() => {
    setRender(null);
  }, [watch()])

  function addEnvByJson(obj: EnvType[]) {
    deployAppend(obj);
  }

  return (
    <div>
      <div className={styles.item}>
        <div className={styles.label}>Build Command</div>
        <div className={styles.content}>
          <Controller
            name={`buildCommand`}
            control={control}
            render={({field}) => (
              <TextField
                size="small"
                sx={IconFocusStyle}
                value={field.value}
                onChange={field.onChange}
                placeholder="yarn install && yarn build"
              />
            )}
            rules={{required: "Please enter build command"}}
          />
          {
            errors.buildCommand?.message &&
            <div className={styles.error}>{errors.buildCommand?.message}</div>
          }
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>Output Directory*</div>
        <div className={styles.content}>
          <Controller
            name={`outputDir`}
            control={control}
            render={({field}) => (
              <TextField
                size="small"
                sx={IconFocusStyle}
                value={field.value}
                onChange={field.onChange}
                placeholder="/dist"
              />
            )}
            rules={{...pathRule, required: "Please entry output directory"}}
          />
          {
            errors.outputDir?.message &&
            <div className={styles.error}>{errors.outputDir?.message}</div>
          }
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}>Dev Command</div>
        <div className={styles.content}>
          <Controller
            name={`devCommand`}
            control={control}
            render={({field}) => (
              <TextField
                size="small"
                sx={IconFocusStyle}
                value={field.value}
                onChange={field.onChange}
                placeholder="yarn dev"
              />
            )}
            rules={{...pathRule, required: "Please entry dev command"}}
          />
          {
            errors.devCommand?.message &&
            <div className={styles.error}>{errors.devCommand?.message}</div>
          }
        </div>
      </div>

      <div className={styles.item}>
        <div className={styles.label}>Port*</div>
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
                placeholder="3000"
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

      <div className={styles.item}>
        <div className={styles.label}>Env Variables</div>
        <div className={styles.content}>
          {deployFields.map((item, index) => (
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
              <img src="/img/application/delete.svg" alt="" onClick={() => deployRemove(index)}
                   className={styles.deleteIcon}/>
            </div>
          ))}
          <div className={styles.add} onClick={() => deployAppend({name: "", value: ''})}>
            ADD ONE
          </div>
        </div>
      </div>
      <div className={styles.item}>
        <div className={styles.label}></div>
        <div className={styles.content}>
          <ImportEnvByJson addEnvByJson={addEnvByJson}/>
          <ImportEnvFileByJson addEnvByJson={addEnvByJson}/>
        </div>
      </div>
    </div>
  )
}
