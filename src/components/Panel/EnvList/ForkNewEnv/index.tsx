import React from "react";
import clsx from "clsx";
import {
  Controller,
  SubmitHandler,
  useForm,
  useFieldArray,
} from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  Switch,
  TextField,
  Typography,
  TypographyProps,
} from "@mui/material";
import { styled } from "@mui/system";
import { cloneDeep, filter, get } from "lodash-es";
import * as yup from "yup";

import styles from "./index.module.scss";

enum EnvType {
  Testing = "Testing",
  Development = "Development",
}

enum FieldsMap {
  EnvType = "Env Type",
  Name = "Name",
  StartPoint = "Start point",
  Backend = "Backend",
  Frontend = "Frontend",
  EnvVariables = "Env Variables",
}

interface FieldsValue {
  [FieldsMap.EnvType]: EnvType;
  [FieldsMap.Name]: string;
  [FieldsMap.StartPoint]: {
    [FieldsMap.Backend]: string;
    [FieldsMap.Frontend]: string;
  };
  [FieldsMap.EnvVariables]: Array<{
    key: string;
    value: string;
  }>;
}

const DefaultFields: FieldsValue = {
  [FieldsMap.EnvType]: EnvType.Development,
  [FieldsMap.Name]: "",
  [FieldsMap.StartPoint]: {
    [FieldsMap.Backend]: "",
    [FieldsMap.Frontend]: "",
  },
  [FieldsMap.EnvVariables]: [],
};

const schema = yup.object().shape({
  [FieldsMap.EnvType]: yup
    .string()
    .oneOf(Object.values(EnvType))
    .default(EnvType.Development)
    .required("Please enter the forked environment name."),
  [FieldsMap.Name]: yup
    .string()
    .required("Please enter the forked environment name."),
  [FieldsMap.StartPoint]: yup.object().shape({
    [FieldsMap.Backend]: yup.string().required("Please choose backend branch."),
    [FieldsMap.Frontend]: yup
      .string()
      .required("Please choose backend branch."),
  }),
  [FieldsMap.EnvVariables]: yup.array().of(
    yup.object().shape({
      key: yup.string(),
      value: yup.string(),
    })
  ),
});

// interface FieldsValue extends yup.InferType<typeof schema>{}

const branches = [
  "default branch(main)",
  "Feat-1",
  "Feat-2",
  "BugFix-1",
  "BugFix-2",
];

export default function ForkNewEnv(): React.ReactElement {
  const {
    control,
    handleSubmit,
    formState: { errors },
    getValues,
  } = useForm({
    defaultValues: DefaultFields,
    resolver: yupResolver(schema),
  });

  const {
    fields: envVariables,
    append: envVariablesAppend,
    remove: envVariablesRemove,
  } = useFieldArray({
    control,
    name: FieldsMap.EnvVariables,
  });

  const submitHandler: SubmitHandler<FieldsValue> = (data) => {};

  return (
    <form className={styles.wrapper} onSubmit={handleSubmit(submitHandler)}>
      <Controller
        name={FieldsMap.EnvType}
        control={control}
        render={({ field }) => (
          <FormControl
            sx={{
              flexDirection: "row",
              alignItems: "center",
              gap: "55px",
            }}
          >
            <HeadlineOne>{FieldsMap.EnvType}</HeadlineOne>
            <RadioGroup row name={FieldsMap.EnvType} value={field.value}>
              <FormControlLabel
                value={EnvType.Testing}
                control={<Radio />}
                label={EnvType.Testing}
              />
              <FormControlLabel
                value={EnvType.Development}
                control={<Radio />}
                label={EnvType.Development}
              />
            </RadioGroup>
          </FormControl>
        )}
      />
      <Controller
        name={FieldsMap.Name}
        control={control}
        render={({ field }) => (
          <FormControl className={styles.nameWrap}>
            <HeadlineOne>{FieldsMap.Name}</HeadlineOne>
            <TextField
              value={field.value}
              onChange={field.onChange}
              error={errors[FieldsMap.Name] !== undefined}
              helperText={
                errors[FieldsMap.Name] && errors[FieldsMap.Name]?.message
              }
              size="small"
            />
          </FormControl>
        )}
      />
      <Box className={styles.switchWrap}>
        <span>*</span>
        Show Advanced Options
        <Switch />
      </Box>
      <div className={styles.startPointWrap}>
        <HeadlineOne>{FieldsMap.StartPoint}:</HeadlineOne>
        <div>
          <HeadlineTwo>{FieldsMap.Backend}</HeadlineTwo>
          <Controller
            name={`${FieldsMap.StartPoint}.${FieldsMap.Frontend}`}
            control={control}
            render={({ field, fieldState, formState }) => (
              <FormControl
                error={
                  errors[FieldsMap.StartPoint] &&
                  errors[FieldsMap.StartPoint]![FieldsMap.Backend] !== undefined
                }
              >
                <Select
                  size="small"
                  value={field.value[FieldsMap.Backend]}
                  onChange={field.onChange}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors[FieldsMap.StartPoint] &&
                    errors[FieldsMap.StartPoint]![FieldsMap.Backend]?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
          <HeadlineTwo>{FieldsMap.Frontend}</HeadlineTwo>
          <Controller
            name={`${FieldsMap.StartPoint}.${FieldsMap.Frontend}`}
            control={control}
            render={({ field }) => (
              <FormControl
                error={
                  errors[FieldsMap.StartPoint] &&
                  errors[FieldsMap.StartPoint]![FieldsMap.Frontend] !==
                    undefined
                }
              >
                <Select
                  size="small"
                  value={field.value[FieldsMap.Frontend]}
                  onChange={field.onChange}
                >
                  {branches.map((branch) => (
                    <MenuItem key={branch} value={branch}>
                      {branch}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText>
                  {errors[FieldsMap.StartPoint] &&
                    errors[FieldsMap.StartPoint]![FieldsMap.Frontend]?.message}
                </FormHelperText>
              </FormControl>
            )}
          />
        </div>
      </div>
      <Controller
        name={FieldsMap.EnvVariables}
        control={control}
        render={({ field }) => (
          <FormControl>
            {envVariables.map((envVariable, index) => (
              <div key={index} className={styles.inputItem}>
                <div className={styles.left}>
                  <Controller
                    name={`${FieldsMap.EnvVariables}.${index}.key`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        sx={{ ...IconFocusStyle, width: "150px" }}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                    rules={{
                      required: "Please input env name",
                      validate: {
                        unconformity: (key) => {
                          if (
                            filter(
                              getValues(FieldsMap.EnvVariables),
                              (item) => item.key === key
                            ).length > 1
                          ) {
                            return "There can be same env key";
                          }
                        },
                      },
                    }}
                  />
                  {get(errors, `env.${index}.name.message`) && (
                    <div className={styles.error}>
                      {get(errors, `env.${index}.name.message`)}
                    </div>
                  )}
                </div>
                <span className={styles.equal}>=</span>
                <div className={styles.right}>
                  <Controller
                    name={`${FieldsMap.EnvVariables}.${index}.value`}
                    control={control}
                    render={({ field }) => (
                      <TextField
                        size="small"
                        sx={{ ...IconFocusStyle, width: "150px" }}
                        value={field.value}
                        onChange={field.onChange}
                      />
                    )}
                    rules={{ required: "Please input env value" }}
                  />
                  {get(errors, `env.${index}.value.message`) && (
                    <div className={styles.error}>
                      {get(errors, `env.${index}.value.message`)}
                    </div>
                  )}
                </div>
                <img
                  src="/img/application/delete.svg"
                  alt=""
                  onClick={() => envVariablesRemove(index)}
                  className={styles.deleteIcon}
                />
              </div>
            ))}
            <div
              className={styles.add}
              onClick={() => envVariablesAppend({ key: "", value: "" })}
            >
              ADD ONE
            </div>
          </FormControl>
        )}
      />
      <Button variant="contained" type="submit">
        Fork
      </Button>
      <Button
        onClick={() => {
          console.group(">>>>>errors<<<<<<");
          console.log(errors);
          console.log();
          console.groupEnd();
        }}
      >
        test
      </Button>
    </form>
  );
}

const HeadlineOne = styled(Typography)<TypographyProps>(() => ({
  fontSize: 15,
  fontWeight: 500,
  fontFamily: "Roboto",
}));

const HeadlineTwo = styled(Typography)<TypographyProps>(() => ({
  fontSize: 14,
  fontFamily: "Roboto",
  color: "#5b7587",
}));

const widthSx = { width: "250px" };

export const IconFocusStyle = {
  background: "#fff",
  borderRadius: "4px",
  ...widthSx,
};
