import { Input, InputLabel, TextField, Typography } from "@mui/material";
import Image from "next/image";

import { CommonProps } from "@/utils/commonType";
import SubTitle from "../SubTitle";
import styles from "./index.module.scss";
import {
  AllFieldName,
  FieldChangeType,
  FormReducerReturnType,
} from "../formData";
import { ChangeEvent, useEffect } from "react";

interface Props extends CommonProps, FormReducerReturnType {}

const [GinIcon, NextIcon, SpringIcon, VueIcon, RemixIcon] = [
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Gin%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Nextjs%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Spring%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Vue%403x.webp",
  "https://assets-1309519128.cos.ap-hongkong.myqcloud.com/Remix%403x.webp",
];

const stacks = {
  "Gin-Next": [GinIcon, NextIcon],
  "Spring-Vue": [SpringIcon, VueIcon],
  "Gin-Vue": [GinIcon, VueIcon],
  Remix: [RemixIcon],
};

export default function BasicApplicationInfo({
  style,
  formData,
  formDataDispatch,
}: Props): React.ReactElement {
  const textChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    formDataDispatch({
      type: FieldChangeType.TextInput,
      field: event.target.name,
      payload: event.target.value,
    });
  };

  useEffect(() => {
    console.log("formData");
    console.log(formData);
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
        {Object.entries(stacks).map(([stackName, icons]) => {
          return (
            <li key={stackName}>
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
      </ul>
    </div>
  );
}
