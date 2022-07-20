import React from "react";
import { Control, Controller, useForm } from "react-hook-form";

import {
  getClusterIcon,
  GinIcon,
  NextIcon,
  PlusIcon,
  RemixIcon,
  SpringIcon,
  VueIcon,
} from "@/utils/CDN";
import { FieldsMap } from "@/pages/[organization]/applications/create";
import { FormControl, TextField } from "@mui/material";
import CardSelect, { CardItems } from "@/basicComponents/CardSelect";

import styles from "./index.module.scss";

interface Props {}

const cardItems: CardItems = [
  {
    icon: GinIcon,
    name: "Micro Service",
  },
  {
    icon: NextIcon,
    name: "Machine Learning",
  },
  {
    icon: RemixIcon,
    name: "Web Application",
  },
];

export default function SelectAStack(props: Props): React.ReactElement {
  const { control } = useForm({
    defaultValues: {
      [FieldsMap.name]: "",
      [FieldsMap.stack]: "",
    },
  });

  return (
    <div className={styles.wrapper}>
      <Controller
        name={FieldsMap.name}
        control={control}
        render={({ field }) => (
          <FormControl className={styles.nameWrap}>
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
                "& .MuiOutlinedInput-input.MuiInputBase-input": {
                  boxSizing: "inherit",
                  height: 36,
                  paddingLeft: "27px",
                },
              }}
            />
          </FormControl>
        )}
      />
      <div className={styles.stackWrap}>
        <Controller
          name={FieldsMap.stack}
          control={control}
          render={({ field }) => (
            <FormControl>
              <h1>
                {FieldsMap.stack}
                <span>*</span>
              </h1>
              <CardSelect
                {...{
                  cardItems,
                  control: control,
                  name: FieldsMap.stack,
                }}
              />
            </FormControl>
          )}
        />
      </div>
    </div>
  );
}
