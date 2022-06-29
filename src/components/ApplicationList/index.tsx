import styles from "./index.module.scss";
import {ApplicationObject, ApplicationStatus} from "@/utils/api/application";
import {getOrganizationNameByUrl} from "@/utils/utils";
import {useRouter} from "next/router";
import {find, get} from "lodash-es";
import {ClusterItem} from "@/utils/api/cluster";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import React from "react";
import {Popover} from "@mui/material";

type Props = {
  list: ApplicationObject[],
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

  function goPanel(appId: number, releaseId: number, stauts: any) {
    if (stauts === ApplicationStatus.COMPLETED) {
      router.push(
        `/${getOrganizationNameByUrl()}/applications/panel?app_id=${appId}&release_id=${releaseId}`
      );
    } else {
      router.push(
        `/${getOrganizationNameByUrl()}/applications/creating?app_id=${appId}&release_id=${releaseId}`
      );
    }
  }

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
        <div className={styles.deleteIcon} onClick={openDeleteDialog}>
          <span>
              Delete
          </span>
        </div>
      </Popover>
      {
        list.map(item => {
          let status = get(item, ['last_release', 'status']);
          let cluster: any = find(clusterList, {id: get(item, ['last_release', 'cluster_id'])});
          let statckIcon = get(item, ['stack', 'icon_urls'], '').split(',')[0];
          if (cluster) {
            cluster = get(cluster, 'name');
          }
          return (
            <div className={styles.itemWrapper} key={item.app_id}>
              <div className={styles.item} onClick={() => goPanel(item.app_id, item.last_release.id, status)}
                   key={item.app_id}>
                <div className={styles.left}>
                  {
                    statckIcon && <img src={statckIcon} alt=""/>
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
                    Owner： <span className={styles.value}>{item.owner_name}</span>
                  </div>
                  <div className={styles.status}>
                    Cluster： <span className={styles.value}> {cluster && cluster}</span>
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
