import { Input, InputLabel, TextField, Typography } from "@mui/material";
import Image from "next/image";

import { CommonProps } from "@/utils/commonType";
import SubTitle from "../SubTitle";
import styles from "./index.module.scss";

interface Props extends CommonProps {}

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
  "Remix": [RemixIcon],
};

export default function BasicApplicationInfo({
  style,
}: Props): React.ReactElement {
  return (
    <div style={style} className={styles.basicApplicationInfoWrap}>
      <SubTitle variant="h5" require>
        Application Name
      </SubTitle>
      <InputLabel />
      <TextField variant="outlined" />
      <SubTitle variant="h5" require>
        Cluster
      </SubTitle>
      <TextField variant="outlined" />
      <SubTitle variant="h5" require>
        Stack
      </SubTitle>
      <ul>
        {Object.entries(stacks).map(([stack, icons]) => {
          return (
            <li key={stack}>
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
            </li>
          );
        })}
      </ul>
    </div>
  );
}
