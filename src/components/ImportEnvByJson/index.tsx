import {TextField} from "@mui/material";

import styles from './index.module.scss';
import {useState} from "react";
import clsx from "clsx";

const difaultValue =
  `{
    "name": "value"
}`


export default function ImportEnvByJson() {
  const [spread, setSpread] = useState<boolean>(false);
  const [value, setValue] = useState<string>(difaultValue);


  function spreadFun() {
    setSpread(!spread)
  }

  function getError(){
    try{
      JSON.parse(value);
      return false;
    }catch (e){
      return true;
    }
  }


  return (
    <div>
      test
      <div className={styles.header} onClick={spreadFun}>
        ADD BY JSON
      </div>


      <div className={clsx(styles.textField, spread && styles.spread)}>
        <TextField
          multiline
          rows={4}
          value={value}
          onChange={(e) => {
            if (e.keyCode === 9) {
              // if (!this.textareValue) this.textareValue= ''
              // this.textareValue+= '\t'
              // 阻止默认切换元素的行为
                e.preventDefault()
            }
            setValue(e.target.value)
          }}
          sx={{width: "100%", height: '100%'}}
          error={getError()}
        />
      </div>

    </div>
  )
}
