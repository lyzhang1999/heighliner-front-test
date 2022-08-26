import {Button} from "@mui/material";
import React, {forwardRef, useContext, useImperativeHandle, useState} from "react";
import {LinkMethod} from "@/pages/[organization]/applications/creation";
import {getRepoListRes} from "@/api/application";
import ServiceItem from "@/components/Application/Create/MicroService/ServiceItem";
import {cloneDeep, get} from "lodash-es";
import styles from "./index.module.scss"
import {MicroServiceInitData} from "@/components/Application/Create/util";
import {Message} from "@/utils/utils";
import {CreateContext} from "@/pages/[organization]/applications/creation/context";
import {FormStateType} from "@/pages/[organization]/applications/creation/context";

export interface Props {
  submitCb: (key: string, value: object, flag?: boolean) => void,
  formState: FormStateType,
}

const MicroService = forwardRef(function Component(props: Props, ref) {
  const {submitCb, formState} = props;
  let {microService} = formState;

  const {state, dispatch} = useContext(CreateContext);
  const {repoList} = state;
  const [microList, setMicroList] = useState<any>(microService);
  const [isNewFlag, setIsNewFlag] = useState<boolean>(false);
  const [spreadItem, setSpreadItem] = useState<number>(() => {
    let value = get(microList, '0.serviceName', '');
    if (value) {
      return -1;
    } else {
      return 0;
    }
  });

  useImperativeHandle(ref, () => ({
    submit: (flag: LinkMethod) => {
      if (flag === LinkMethod.BACK) {
        backCb();
      } else {
        submit();
      }
    }
  }));

  function backCb() {
    if (spreadItem !== -1) {
      Message.error('Please complete the current page form');
      return;
    }
    submitCb('microService', microList, true)
  }

  function submit() {
    if (spreadItem !== -1) {
      Message.error('Please complete the current page form');
      return;
    }
    submitCb('microService', microList)
  }

  function addService() {
    let length = microList.length;
    setMicroList([...microList, MicroServiceInitData]);
    setIsNewFlag(true);
    setSpreadItem(length);
  }

  return (
    <div>
      <div className={styles.microList}>
        {
          microList.map((item: any, index: number) => {
            if (spreadItem === index) {
              return <ServiceItem
                key={item.serviceName + index}
                {...{
                  currentIndex: spreadItem,
                  microList,
                  setSpreadItem,
                  setMicroList,
                  repoList,
                  isNewFlag
                }}
              />
            }
            return (
              <div className={styles.microItem} key={item.serviceName + index + 'item'}>
                <div className={styles.serviceName}>
                  Service: <span className={styles.name}> {item.serviceName}</span>
                </div>
                <div className={styles.rightAction}>
                  <Button variant="outlined"
                          disabled={spreadItem !== -1}
                          onClick={() => {
                            setSpreadItem(index);
                            setIsNewFlag(false);
                          }}
                  >
                    Edit
                  </Button>
                  <Button variant="outlined"
                          color="error"
                          sx={{marginLeft: "10px"}}
                          disabled={(spreadItem !== -1) || (microList.length === 1)}
                          onClick={() => {
                            let list = cloneDeep(microList);
                            list.splice(index, 1);
                            setMicroList(list);
                          }}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )
          })
        }
      </div>
      <Button
        // variant="outlined"
        className={styles.addService}
        disabled={(spreadItem !== -1)}
        onClick={addService}
        sx={{marginTop: '20px'}}
        variant="contained"
      >Add A Service</Button>
    </div>
  )
});
export default MicroService;

