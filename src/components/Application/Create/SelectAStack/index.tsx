import React, {
  forwardRef,
  ForwardRefRenderFunction, useContext,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import {Controller, FieldValues, useForm} from "react-hook-form";
import Image from "next/image";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import clsx from "clsx";

import {FormControl, FormHelperText, TextField} from "@mui/material";
import CardSelect, {CardItems} from "@/basicComponents/CardSelect";
import {FormStateType} from "@/pages/[organization]/applications/creation";
import useStacks from "@/hooks/stacks";
import {FieldsMap} from "@/components/Application/Create/util";

import styles from "./index.module.scss";
import {nameRule} from "@/utils/formRules";
import {CreateContext} from "@/pages/[organization]/applications/creation/context";

interface Props {
  submitCb: Function;
  formState: FormStateType;
}

export const StackCardItems = [
  {
    name: "Micro Service",
    url: "/img/application/create/MicroService@3x.webp",
    key: "micro"
  },
  {
    name: "Web Application",
    url: "/img/application/create/WebApplication@3x.webp",
    key: "web"
  },
  {
    name: "Machine Learning",
    url: "/img/application/create/MachineLearning@3x.webp",
    key: "machine"
  },

];

const SelectAStack = forwardRef(function SelectAStack(
  props: Props,
  ref
): React.ReactElement {
  // const [stackList, getStackList] = useStacks();
  // const [stackCardItems, setStackCardItems] = useState<CardItems>([]);
  const {selectAStack: selectAStackInitState} = props.formState;

  const DefaultFormValue: FieldValues = {
    [FieldsMap.name]: selectAStackInitState[FieldsMap.name],
    [FieldsMap.stack]: selectAStackInitState[FieldsMap.stack],
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: DefaultFormValue,
  });

  const submit = (data: typeof DefaultFormValue) => {
    props.submitCb("selectAStack", data);
  };

  useImperativeHandle(ref, () => ({
    submit: () => {
      handleSubmit(submit)();
    },
  }));

  return (
    <div className={styles.wrapper}>
      <Controller
        name={FieldsMap.name}
        control={control}
        render={({field}) => (
          <FormControl
            className={styles.nameWrap}
            error={errors[FieldsMap.name] !== undefined}
          >
            <h1>
              {FieldsMap.name}
              <span>*</span>
            </h1>
            <TextField
              autoFocus
              value={field.value}
              onChange={field.onChange}
              sx={{
                boxSizing: "border-box",
                fontSize: 15,
                "& .MuiOutlinedInput-root.MuiInputBase-root": {
                  paddingLeft: 0,
                  ".MuiSvgIcon-root": {
                    display: "none",
                  },
                  ".MuiOutlinedInput-input.MuiInputBase-input": {
                    width: 204,
                    boxSizing: "inherit",
                    height: 36,
                    paddingLeft: "26px",
                  },
                  ".MuiOutlinedInput-notchedOutline": {
                    width: 204,
                  },
                  "&.Mui-error": {
                    paddingLeft: "19px",
                    ".MuiOutlinedInput-notchedOutline": {
                      borderColor: "#f56c6c",
                    },
                    ".MuiSvgIcon-root": {
                      display: "block",
                    },
                    ".MuiOutlinedInput-input.MuiInputBase-input": {
                      paddingLeft: "9px",
                    },
                  },
                },
              }}
              error={errors[FieldsMap.name] !== undefined}
              // helperText={errors[FieldsMap.name] && errors[FieldsMap.name].message}
              InputProps={{
                startAdornment: (
                  <ErrorOutlineIcon
                    sx={{
                      color: "#ff5252",
                    }}
                    fontSize="small"
                  />
                ),
              }}
            />
            <FormHelperText
              style={{
                gridColumn: "2 / 3",
                color: "#F85056",
              }}
            >
              {errors[FieldsMap.name] && errors[FieldsMap.name].message}
            </FormHelperText>
          </FormControl>
        )}
        rules={{
          /** Follow with RFC 1035 */
          required: "Please enter your application name.",
          validate: nameRule,
          maxLength: {
            value: 63,
            message: "The max length is 63 character.",
          },
        }}
      />
      <Controller
        name={FieldsMap.stack}
        control={control}
        render={({field}) => (
          <FormControl
            className={styles.stackWrap}
            error={errors[FieldsMap.stack] !== undefined}
          >
            <h1>
              {FieldsMap.stack}
              <span>*</span>
            </h1>
            <ul>
              {StackCardItems.map((stackCardItems, index) => (
                <li
                  key={stackCardItems.key}
                  onClick={() => {
                    field.onChange(stackCardItems.key);
                  }}
                  className={clsx(
                    field.value === stackCardItems.key && styles.chosen,
                    stackCardItems.key !== "micro" && styles.disabled
                  )}
                >
                  <div>
                    <Image
                      src={stackCardItems.url}
                      alt=""
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                  <span>{stackCardItems.name}</span>
                </li>
              ))}
            </ul>
            <FormHelperText>
              {errors[FieldsMap.stack] && errors[FieldsMap.stack].message}
            </FormHelperText>
          </FormControl>
        )}
        rules={{
          required: "Please choose a stack.",
        }}
      />
    </div>
  );
});

export default SelectAStack;
