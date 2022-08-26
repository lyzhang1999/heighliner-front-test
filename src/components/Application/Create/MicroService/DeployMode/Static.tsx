import {functions} from "lodash-es";
// import styles from "@/components/Application/Create/FrontEnd/index.module.scss";
import {Controller} from "react-hook-form";
import {MenuItem, Select, TextField} from "@mui/material";
import {getRepoListRes} from "@/api/application";
import React, {useEffect, useState} from "react";
import {DeplodModeList, IconFocusStyle, StaticDeployModeList} from "@/components/Application/Create/FrontEnd";
import {pathRule, portRule} from "@/utils/formRules";
import styles from "../serviceItem.module.scss";

interface Props {
  getValues: any,
  control: any,
  errors: any,
  watch: any
}

export default function Static({getValues, control, errors, watch}: Props) {
  const [render, setRender] = useState<null>(null);

  useEffect(() => {
    setRender(null);
  }, [watch()])

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
        <div className={styles.label}>Static Type*</div>
        <div className={styles.content}>
          <Controller
            name={`staticType`}
            control={control}
            render={({field}) => (
              <Select
                value={field.value}
                onChange={field.onChange}
                size="small"
                sx={{background: "#fff", width: "250px"}}
              >
                {
                  StaticDeployModeList.map(item => {
                    return (
                      <MenuItem value={item.key} key={item.key}>{item.value}</MenuItem>
                    )
                  })
                }
              </Select>
            )}
            rules={{
              required: "Please select static type",
            }}
          />
          {
            errors.staticType?.message &&
            <div className={styles.error}>{errors.staticType?.message}</div>
          }
        </div>
      </div>
      {
        (getValues('staticType') === 'mpa') &&
        <div className={styles.item}>
          <div className={styles.label}>404 Path*</div>
          <div className={styles.content}>
            <Controller
              name={`path404`}
              control={control}
              render={({field}) => (
                <TextField
                  size="small"
                  sx={IconFocusStyle}
                  value={field.value}
                  onChange={field.onChange}
                  placeholder="/404.html"
                />
              )}
              rules={{...pathRule, required: "Please entry 404 path"}}
            />
            {
              errors.path404?.message &&
              <div className={styles.error}>{errors.path404?.message}</div>
            }
          </div>
        </div>
      }
    </div>
  )
}
