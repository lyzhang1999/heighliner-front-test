/**
 * Cluster Item
 */

import React from "react";

import {
  TableCell, TableRow,
} from '@mui/material';

import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  getClusterIcon,
} from "@/utils/CDN";

import {
  ClusterItem,
  ClusterStatus,
} from "@/utils/api/cluster";

import { StatusDot, StatusIconText } from './Status';

import styles from './index.module.scss';

type Props = {
  item: ClusterItem,
  handleClick: (id: number) => (e: React.MouseEvent<HTMLDivElement>) => void,
}

function getStatusText(status: ClusterStatus): string {
  const map = {
    [ClusterStatus.Active]: 'Running',
    [ClusterStatus.Initializing]: 'Creating',
    [ClusterStatus.Inactive]: 'Failed',
  }
  return map[status]
}

export const ClusterItemComp = ({
  item,
  handleClick,
}: Props): React.ReactElement => {
  return (
    <TableRow
      className={styles.clusterItem}
      sx={{'&:last-child td, &:last-child th': {border: 0}}}
    >
      <TableCell align="right" width={200}>
        <div className={styles.clusterMeta}>
          <div className={styles.status}>
            <StatusDot status={item.status} />
          </div>
          <div className={styles.icon} title={getStatusText(item.status)}>
            <img src={getClusterIcon(item.provider)} alt="cluster provider"/>
          </div>
          <div className={styles.name} title={item.name}>{item.name}</div>
        </div>
      </TableCell>
      <TableCell align="left" className={styles.regionColumn}>
        <div className={styles.region}>Hong Kong</div>
      </TableCell>
      <TableCell>
        <div className="creator">{item.created_by_name}</div>
      </TableCell>
      <TableCell>
        <div className={styles.version}>{'v1.22.6'}</div>
      </TableCell>
      <TableCell align="right">
        <div className={styles.status}>
          <StatusIconText status={item.status} />
        </div>
        <div className={styles.moreIcon} onClick={handleClick(item.id)}>
          <MoreVertIcon />
        </div>
      </TableCell>
    </TableRow>
  )
}
