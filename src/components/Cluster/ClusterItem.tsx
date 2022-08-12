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
} from "@/api/cluster";

import {StatusDot, StatusIconText} from './Status';

import styles from './index.module.scss';
import {formatDate} from "@/utils/utils";

type Props = {
  item: ClusterItem,
  handleClick: (id: number) => (e: React.MouseEvent<HTMLDivElement>) => void,
}

// function getStatusText(status: ClusterStatus): string {
//   const map = {
//     [ClusterStatus.ACTIVE]: 'Running',
//     [ClusterStatus.INITIALIZING]: 'Creating',
//     [ClusterStatus.INACTIVE]: 'Failed',
//   }
//   return map[status]
// }

export const ClusterItemComp = ({ item, handleClick }: Props): React.ReactElement => {
  return (
    <TableRow
      className={styles.clusterItem}
      sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
    >
      <TableCell align="right" width={200}>
        <div className={styles.clusterMeta}>
          <div className={styles.status}>
            <StatusDot status={item.status} />
          </div>
          <div className={styles.icon} title={item.status}>
            <img src={getClusterIcon(item.provider)} alt="cluster provider" />
          </div>
          <div className={styles.name} title={item.name}>
            {item.name}
          </div>
        </div>
      </TableCell>
      {/* <TableCell align="right" className={styles.regionColumn}>
        <div className={styles.region}>Hong Kong</div>
      </TableCell> */}
      <TableCell align="right">
        <div className="creator">{item.created_by_name}</div>
      </TableCell>
      {/* <TableCell align="right">
        <div className={styles.version}>{'v0.0.0'}</div>
      </TableCell> */}
      <TableCell align="right">
        <div className={styles.time}>{formatDate(item.created_at * 1000)}</div>
      </TableCell>
      <TableCell align="right">
        <div className={styles.time}>
          {item.expire_at > 0 ? formatDate(item.expire_at * 1000) : "-"}
        </div>
      </TableCell>
      <TableCell align="right">
        {/* <div className={styles.status}> */}
        <StatusIconText status={item.status} />
        {/* </div> */}
      </TableCell>
      <TableCell align="right" sx={{ minWidth: "130px" }}>
        <div className={styles.moreIcon} onClick={handleClick(item.id)}>
          <MoreVertIcon />
        </div>
      </TableCell>
    </TableRow>
  );
};
