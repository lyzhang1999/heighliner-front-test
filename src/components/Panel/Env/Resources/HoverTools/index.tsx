import React, { useState, useEffect, useContext } from "react";
import clsx from "clsx";
import Image from "next/image";
import CancelIcon from '@mui/icons-material/Cancel';

import { Context } from "@/utils/store";

import { IEnvContext, EnvContext } from '@/utils/contexts';

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";
import {getToken} from "@/utils/token";

interface Props extends CommonProps {}

enum DevStatus {
  NORMAL = 'normal',
  RUNNING = 'running',
  INITING = 'initing',
}

export default function HoverTools(props: any) {
  const {state: globalState, dispatch: globalStateDispatch} = useContext(Context);
  const envContext: IEnvContext = useContext(EnvContext);

  const [devState, setDevState] = useState<DevStatus>(DevStatus.NORMAL);

  useEffect(() => {
    if (props.resource.container) {
      props.resource.container.forEach((container: any) => {
        if (container.name === 'nocalhost-dev') {
          setDevState(DevStatus.RUNNING)
        }
      })
    }
  }, [props.resource])

  const { env, resource } = props;

  console.log(resource)

  function getParameters() {
    const token = getToken();
    if (!token) {
      console.error('Error: No token found, exit.')
      return
    }

    const {
      namespace, name, type,
    } = resource

    const parameters: any = {
      token,
      kubeconfig: envContext.kubeconfig,
      namespace: namespace,
      application: 'default',
      workload_type: type,
      workload: name,
      action: 'debug',
      organization: globalState?.currentOrganization?.name,
      email: globalState?.userInfo?.email,
      app: env.application_id,
      service: name,
      env: env.name,
    }

    return parameters;
  }

  // function getToken() {
  //   let cookeiStr: string = window.document.cookie;
  //   const cookies: string[] = cookeiStr.split('; ')
  //   let token = ''
  //   for (let cookie of cookies) {
  //     if (cookie.startsWith('token=')) {
  //       token = cookie.replace(/^token=/, '')
  //       break
  //     }
  //   }
  //   return token
  // }

  function wakeUpVSCode(qsObj: any): void {
    const searchParams = new URLSearchParams(qsObj)
     window.open(`vscode://forkmain.forkmain?${searchParams.toString()}`)
  }

  const handleDebug = () => {
    const parameters = getParameters()
    wakeUpVSCode(parameters)
  }

  const handleRun = () => {
    const parameters = getParameters()
    parameters['action'] = 'run'
    wakeUpVSCode(parameters)
  }

  const handleStopDev = () => {
    const parameters = getParameters()
    parameters['action'] = 'stop'
    wakeUpVSCode(parameters)
  }

  return (
    <ul className={styles.wrapper}>
      <li>
        <Image src="/img/application/panel/env/circle@3x.png" layout="fill" objectFit="contain" alt="" />
      </li>
      <li>
        <Image src="/img/application/panel/env/circuit@3x.png" layout="fill" objectFit="contain" alt="" />
      </li>
      <li>
        <Image src="/img/application/panel/env/edit@3x.png" layout="fill" objectFit="contain" alt="" />
      </li>
      <li>
        <Image src="/img/application/panel/env/setting@3x.png" layout="fill" objectFit="contain" alt="" />
      </li>
      {
        devState === DevStatus.RUNNING ? (
          <li onClick={handleStopDev} title="Stop">
            <CancelIcon />
          </li>
        ) : (
          <div style={{ display: 'flex' }}>
            <li onClick={handleDebug} title="Debug" style={{ marginRight: 10 }}>
              <Image src="/img/application/panel/env/debug@3x.png" layout="fill" objectFit="contain" alt="" />
            </li>
            <li onClick={handleRun} title="Develop">
              <Image src="/img/application/panel/env/start@3x.png" layout="fill" objectFit="contain" alt="" />
            </li>
          </div>
          )
      }
    </ul>
  );
}
