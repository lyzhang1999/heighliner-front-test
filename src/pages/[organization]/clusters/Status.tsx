/**
 * Render Status components
 * 
 */

import React from "react";
import clsx from "clsx";
import Image from "next/image";

import {
  ClusterStatus,
} from "@/utils/api/cluster";

import styles from './index.module.scss';

type Props = {
  status: string
}

export const StatusDot = ({
  status,
}: Props): React.ReactElement => {
  return (
    <div className={clsx(styles[`${status}Dot`], styles.statusDot)}></div>
  )
}

export const StatusIconText = ({
  status,
}: Props): React.ReactElement => {
  let icon = '', text = ''

  switch (status) {
    case ClusterStatus.Active:
      text = 'Running'
      icon = '/img/cluster/active-status.webp'
      break
    case ClusterStatus.Inactive:
      text = 'Failed'
      icon = '/img/cluster/failed-status.webp'
      break
    case ClusterStatus.Initializing:
      text = 'Creating'
      icon = '/img/cluster/creating-status.webp'
      break
  }

  return (
    <div className={clsx(styles[`${status}IconText`], styles.statusIconText)}>
      <Image width={21} height={21} src={icon} alt="status" />
      <span style={{ marginLeft: 8 }}>
        {text}
      </span>
    </div>
  )
}
