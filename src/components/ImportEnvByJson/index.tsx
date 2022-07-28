import {TextField} from "@mui/material";

import styles from './index.module.scss';
import {useState} from "react";
import clsx from "clsx";
import {Message} from "@/utils/utils";
import {EnvType} from "@/components/Application/Create/util";

const defaultValue =
  `{
    "env": "value"
}`

interface Props {
  addEnvByJson: (arr: EnvType[]) => void
}

export default function ImportEnvByJson({addEnvByJson}: Props) {
  const [spread, setSpread] = useState<boolean>(false);
  const [value, setValue] = useState<string>(defaultValue);


  function spreadFun() {
    setSpread(!spread)
  }

  function getError() {
    try {
      JSON.parse(value);
      return false;
    } catch (e) {
      return true;
    }
  }

  function handleOk() {
    if (!spread) {
      setSpread(true);
      return;
    } else {
      let obj = null;
      try {
        obj = JSON.parse(value);
      } catch (e) {
        Message.error('Parse Json Error');
        return;
      }
      let arr: EnvType[] = Object.entries(obj).map(item => {
        return {name: item[0], value: item[1] as string}
      })
      addEnvByJson(arr);
      setSpread(false);
      setValue(defaultValue)
    }
  }

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.btn} onClick={() => handleOk()}>
          {
            spread ? "ADD" : "ADD BY JSON"
          }
        </div>
        {
          spread &&
          <div className={styles.btn} onClick={spreadFun}>
            Cancel
          </div>
        }
      </div>
      <div className={clsx(styles.textField, spread && styles.spread)}>
        <TextField
          multiline
          rows={4}
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
          }}
          sx={{width: "100%", height: '100%'}}
          error={getError()}
        />
      </div>

    </div>
  )
}
