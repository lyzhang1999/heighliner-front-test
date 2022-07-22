import React, {
  forwardRef,
  ForwardRefRenderFunction,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { Controller, FieldValues, useForm } from "react-hook-form";
import Image from "next/image";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import clsx from "clsx";

import { FormControl, FormHelperText, TextField } from "@mui/material";
import CardSelect, { CardItems } from "@/basicComponents/CardSelect";
import { FormStateType } from "@/pages/[organization]/applications/creation";
import useStacks from "@/hooks/stacks";
import { FieldsMap, SelectAStackType } from "@/pages/[organization]/applications/creation/util";

import styles from "./index.module.scss";
interface Props {
  submitCb: Function;
  formState: FormStateType;
}

const StackCardItems = [
  {
    name: "Micro service",
    url: "/img/application/create/MachineLearning@3x.webp",
  },
  {
    name: "Machine Learning",
    url: "/img/application/create/MicroService@3x.webp",
  },
  {
    name: "Web Application",
    url: "/img/application/create/WebApplication@3x.webp",
  },
];

const SelectAStack = forwardRef(function SelectAStack(
  props: Props,
  ref
): React.ReactElement {
  const { selectAStack: selectAStackInitState } = props.formState;

  const DefaultFormValue: FieldValues = {
    [FieldsMap.name]: selectAStackInitState[FieldsMap.name],
    [FieldsMap.stack]: selectAStackInitState[FieldsMap.stack],
  };
  const {
    control,
    handleSubmit,
    formState: { errors },
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
        render={({ field }) => (
          <FormControl
            className={styles.nameWrap}
            error={errors[FieldsMap.name] !== undefined}
          >
            <h1>
              {FieldsMap.name}
              <span>*</span>
            </h1>
            <TextField
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
          validate: {
            illegalCharacter: (value) =>
              !/[^a-z0-9-]/.test(value) ||
              "The name should only contain lowercase alphanumeric character, or hyphen(-).",
            illegalStart: (value) =>
              /^[a-z]/.test(value) ||
              "The name should start with lowercase letter character.",
            illegalEnd: (value) =>
              /[a-z0-9]$/.test(value) ||
              "Then name should end with lowercase alphanumeric character.",
          },
          maxLength: {
            value: 63,
            message: "The max length is 63 character.",
          },
        }}
      />
      <Controller
        name={FieldsMap.stack}
        control={control}
        render={({ field }) => (
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
                  key={stackCardItems.name}
                  onClick={() => {
                    field.onChange(stackCardItems.name);
                  }}
                  className={clsx(
                    field.value === stackCardItems.name && styles.chosen
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

function getIcons(icons: string[]) {
  if (icons.length === 1) {
    return icons[0];
  }
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
      }}
    >
      {icons.map((icon, index) => (
        <div
          key={index}
          style={{
            position: "relative",
            height: 45,
            width: 45,
          }}
        >
          <Image src={icon} alt="" layout="fill" objectFit="contain" />
        </div>
      ))}
    </div>
  );
}

function getIcon(url: string) {
  return (
    <div
      style={{
        height: 54,
        width: 50,
        position: "relative",
        marginTop: "9px",
      }}
    >
      <Image src={url} alt="" layout="fill" objectFit="contain" />
    </div>
  );
}

export default SelectAStack;
