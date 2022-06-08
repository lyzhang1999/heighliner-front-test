import { Input, InputLabel, TextField, Typography } from "@mui/material";
import Image from "next/image";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";
import SubTitle from "../SubTitle";
import styles from "./index.module.scss";
import {
  AllFieldName,
  FieldChangeType,
  FormReducerReturnType,
} from "../formData";
import { ChangeEvent, useEffect, useState } from "react";
import { getStacks, Stacks } from "@/utils/api/stack";

interface Props extends CommonProps, FormReducerReturnType {}

const [GinIcon, NextIcon, SpringIcon, VueIcon, RemixIcon] = [
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Gin%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Nextjs%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Spring%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Vue%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Remix%403x.webp",
];

const stacksMap: { [index: string]: string[] } = {
  ["gin-next"]: [GinIcon, NextIcon],
  ["spring-vue"]: [SpringIcon, VueIcon],
  ["gin-vue"]: [GinIcon, VueIcon],
  ["remix"]: [RemixIcon],
  ["gin"]: [GinIcon],
};

export default function BasicApplicationInfo({
  style,
  formData,
  formDataDispatch,
}: Props): React.ReactElement {
  const [stacks, setStacks] = useState<Stacks>([]);

  const textChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    formDataDispatch({
      type: FieldChangeType.TextInput,
      field: event.target.name,
      payload: event.target.value,
    });
  };

  const chooseStackHandler = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number
  ) => {
    formDataDispatch({
      type: FieldChangeType.TextInput,
      field: AllFieldName.StackCode,
      payload: index,
    });
  };

  useEffect(() => {
    getStacks().then((res) => {
      setStacks(res);
      console.log(res);
    });
  }, []);

  return (
    <div style={style} className={styles.basicApplicationInfoWrap}>
      <SubTitle variant="h5" require>
        Application Name
      </SubTitle>
      <TextField
        variant="outlined"
        name={AllFieldName.ApplicationName}
        className={styles.applicationName}
        onChange={(e) => {
          textChangeHandler(e);
        }}
        value={formData[AllFieldName.ApplicationName]}
      />
      <SubTitle variant="h5" require>
        Cluster
      </SubTitle>
      <TextField variant="outlined" className={styles.cluster} />
      <SubTitle variant="h5" require>
        Stack
      </SubTitle>
      <ul className={styles.stacks}>
        {stacks.map(({ name, id }) => {
          const icons = stacksMap[name];

          return (
            <li
              key={name}
              onClick={(event) => {
                chooseStackHandler(event, id);
              }}
              className={clsx(
                id === formData[AllFieldName.StackCode] && styles.chosenStack
              )}
            >
              <div className={styles.icons}>
                <Image
                  src={icons[0]}
                  alt="Without Heighliner"
                  width={67}
                  height={67}
                  loader={({ src }) => src}
                />
                {icons[1] && (
                  <Image
                    src={icons[1]}
                    alt="Without Heighliner"
                    loader={({ src }) => src}
                    width={67}
                    height={67}
                  />
                )}
              </div>
              <Typography align="center">{name}</Typography>
            </li>
          );
        })}
      </ul>

      {/* <ul className={styles.stacks}>
        {Object.entries(stacks).map(([stackName, icons], index) => {
          return (
            <li
              key={stackName}
              onClick={(event) => {
                chooseStackHandler(event, index);
              }}
              className={clsx(
                index === formData[AllFieldName.StackCode] && styles.chosenStack
              )}
            >
              <div className={styles.icons}>
                <Image
                  src={icons[0]}
                  alt="Without Heighliner"
                  width={67}
                  height={67}
                  loader={({ src }) => src}
                />
                {icons[1] && (
                  <Image
                    src={icons[1]}
                    alt="Without Heighliner"
                    loader={({ src }) => src}
                    width={67}
                    height={67}
                  />
                )}
              </div>
              <Typography align="center">{stackName}</Typography>
            </li> 
          );
        })}
      </ul> */}
    </div>
  );
}
