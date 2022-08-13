import styles from "./index.module.scss";
import {ApplicationObject, ApplicationStatus} from "@/api/application";
import {getUrlEncodeName} from "@/utils/utils";
import {useRouter} from "next/router";
import {find, get} from "lodash-es";
import {ClusterItem} from "@/api/cluster";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import {Popover, Skeleton} from "@mui/material";
import popStyles from "@/components/PopSelect/index.module.scss";
import clsx from "clsx";

type Props = {
  list: ApplicationObject[] | null,
  clusterList: ClusterItem[],
  setDeleteID: React.Dispatch<React.SetStateAction<number>>,
  setDeleteModalVisible: React.Dispatch<React.SetStateAction<boolean>>
  anchorEl: HTMLButtonElement | null,
  setAnchorEl: React.Dispatch<React.SetStateAction<HTMLButtonElement | null>>,
}

export default function ApplicationList({
                                          list,
                                          clusterList,
                                          setDeleteID,
                                          setDeleteModalVisible,
                                          anchorEl,
                                          setAnchorEl
                                        }: Props) {
  const handleClick = (e: any, id: number) => {
    e.stopPropagation();
    setAnchorEl(e?.currentTarget);
    setDeleteID(id);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  function openDeleteDialog() {
    setDeleteModalVisible(true);
  }

  const router = useRouter();
    
  const handleGoPanel = (app_id: number) => () => {
    router.push(`/${getUrlEncodeName()}/applications/panel?app_id=${app_id}`);
  };

  return (
    <div className={styles.wrapper}>
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
      >
        <div className={popStyles.selectWrapper} onClick={openDeleteDialog}>
          <span className={clsx(popStyles.selectItem, popStyles.redItem)}>Delete</span>
        </div>
      </Popover>
      {
        list == null && 
        (
          <>
            {[1, 2, 3].map(i => (
              <Skeleton
                key={i} 
                width={300}
                height={112}
                variant="rectangular"
                sx={{
                  borderRadius: '6px'
                }} 
              />
            ))}
          </>
        )
      }
      {
        list && list.map(item => {
          let status = get(item, ['last_release', 'status']);
          let cluster: any = find(clusterList, {id: get(item, ['last_release', 'cluster_id'])});
          let stackIcon = get(item, ['stack', 'icon_urls'], '').split(',')[0];
          if (cluster) {
            cluster = get(cluster, 'name');
          }
          return (
            <div className={styles.itemWrapper} key={item.app_id}>
              <div className={styles.item} onClick={handleGoPanel(item.app_id)}
                  key={item.app_id}>
                <div className={styles.left}>
                  {
                    stackIcon && <img src={stackIcon} alt=""/>
                  }
                </div>
                <div className={styles.right}>
                  <div className={styles.title}>
                    <span className={styles.name}>{item.app_name}</span>
                    <span className={styles.statusWrapper}>
                      {
                        (status === ApplicationStatus.COMPLETED) &&
                        <span className={styles.statusIcon}>
                          <img src="/img/application/create.webp" alt=""/>
                          <span className={styles.running}>running</span>
                        </span>
                      }
                      {
                        (status === ApplicationStatus.PROCESSING) &&
                        <span className={styles.statusIcon}>
                          <img src="/img/application/creating.webp" alt="" className={styles.rotate}/>
                          <span className={styles.creating}>Creating</span>
                        </span>
                      }
                      {
                        (status === ApplicationStatus.FAILED) &&
                        <span className={styles.statusIcon}>
                          <img src="/img/application/createfailed.webp" alt=""/>
                          <span className={styles.failed}>Failed</span>
                        </span>
                      }
                      <div
                        className={styles.moreIcon}
                        onClick={(e) => handleClick(e, get(item, 'app_id'))}
                      >
                          <MoreVertIcon/>
                        </div>
                    </span>
                  </div>
                  <div className={styles.status}>
                    Owner: <span className={styles.value}>{item.owner_name}</span>
                  </div>
                  <div className={styles.status}>
                    Cluster: <span className={styles.value}> {cluster && cluster}</span>
                  </div>
                  {
                    get(item, ['stack', 'name']) &&
                    <span className={styles.stack}>
                      {get(item, ['stack', 'name'])}
                    </span>
                  }
                </div>
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
