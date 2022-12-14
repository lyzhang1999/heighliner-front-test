/**
 * Render Status components
 * 
 */

import React from "react";
import clsx from "clsx";
import Image from "next/image";

import {
  ClusterStatus,
} from "@/api/cluster";

import styles from './index.module.scss';

type Props = {
  status: ClusterStatus;
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
    case ClusterStatus.ACTIVE:
      text = 'Running'
      icon = '/img/cluster/active-status.webp'
      break
    case ClusterStatus.INACTIVE:
      text = 'Failed'
      icon = '/img/cluster/failed-status.webp'
      break
    case ClusterStatus.INITIALIZING:
      text = 'Creating'
      icon = '/img/cluster/creating-status.webp'
      break
    case ClusterStatus.EXPIRED:
      text = 'Expired'
      icon = '/img/cluster/failed-status.webp'
  }

  return (
    <div className={clsx(styles[`${status}IconText`], styles.statusIconText)}>
      <span style={{ marginRight: 5 }}>
        {text}
      </span>
      <Image width={21} height={21} src={icon} alt="status" />
    </div>
  )
}
