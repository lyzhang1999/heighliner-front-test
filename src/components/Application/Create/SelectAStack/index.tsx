import CardSelect, { CardItems } from "@/basicComponents/CardSelect";
import { FieldsMap } from "@/pages/[organization]/applications/create";
import { FormControl, TextField } from "@mui/material";
import React from "react";
import { Control, Controller } from "react-hook-form";

import styles from "./index.module.scss";

interface Props {
  control: Control;
}

const cardItems: CardItems = [
  {
    icon: "",
    name: "Micro Service",
  },
  {
    icon: "",
    name: "Machine Learning",
  },
  {
    icon: "",
    name: "Web Application",
  },
];

export default function SelectAStack(props: Props): React.ReactElement {
  return (
    <div className={styles.wrapper}>
      <Controller
        name={FieldsMap.name}
        control={props.control}
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
          control={props.control}
          render={({ field }) => (
            <FormControl>
              <h1>
                {FieldsMap.stack}
                <span>*</span>
              </h1>
              <CardSelect
                {...{
                  cardItems,
                  control: props.control,
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
