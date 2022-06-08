import {
  Input,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import Image from "next/image";
import clsx from "clsx";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

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
import { Clusters, getClusterList } from "@/utils/api/cluster";
import NewClusterModal from "@/components/NewClusterModal";

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
  const [clusters, setClusters] = useState<Clusters>([]);
  const [modalDisplay, setModalDisplay] = useState<boolean>(false); // Toggle create cluster drawer knob

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
    stackCode: number
  ) => {
    formDataDispatch({
      type: FieldChangeType.TextInput,
      field: AllFieldName.StackCode,
      payload: stackCode,
    });
  };

  const chooseCluster = (
    event:
      | SelectChangeEvent<string>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (+event.target.value === -99) {
      setModalDisplay(true);
    } else {
      formDataDispatch({
        type: FieldChangeType.TextInput,
        field: event.target.name,
        payload: event.target.value,
      });
    }
  };

  useEffect(() => {
    getStacks().then((res) => {
      setStacks(res);
    });
    getClusterList().then((res) => {
      setClusters(res);
    });
  }, []);

  useEffect(() => {
    getClusterList().then((res) => {
      setClusters(res);
    });
  }, [modalDisplay]);

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
      <Select
        value={formData[AllFieldName.Cluster] + ''}
        onChange={chooseCluster}
        // onOpen={openHandler}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        name={AllFieldName.Cluster}
        style={{ minWidth: 195 }}
      >
        {clusters.map(({ id, name }) => (
          <MenuItem key={id} value={id}>
            {name}
          </MenuItem>
        ))}
        <MenuItem value={-99}>
          <AddCircleOutlineIcon />
          &nbsp; Add
        </MenuItem>
      </Select>
      {/* <TextField variant="outlined" className={styles.cluster} /> */}
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
                id === +formData[AllFieldName.StackCode] && styles.chosenStack
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
      <NewClusterModal
        setModalDisplay={setModalDisplay}
        modalDisplay={modalDisplay}
      />
    </div>
  );
}
