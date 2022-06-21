import styles from "./index.module.scss";
import {ApplicationObject, ApplicationStatus} from "@/utils/api/application";
import {formatDate, getOrganizationNameByUrl} from "@/utils/utils";
import {useRouter} from "next/router";
import {GinIcon} from "@/utils/CDN";
import {find, get} from "lodash-es";
import {ClusterItem} from "@/utils/api/cluster";

type Props = { list: ApplicationObject[], clusterList: ClusterItem[] }

export default function ApplicationList({list, clusterList}: Props) {
  const router = useRouter();

  function goPanel(appId: number, releaseId: number) {
    router.push(
      `/${getOrganizationNameByUrl()}/applications/panel?app_id=${appId}&release_id=${releaseId}`
    );
  }

  return (
    <div className={styles.wrapper}>
      {
        list.map(item => {
          let status = get(item, ['last_release', 'status']);
          let cluster: any = find(clusterList, {id: get(item, ['last_release', 'cluster_id'])});
          if (cluster) {
            cluster = get(cluster, 'name');
          }
          return (
            <div className={styles.item} onClick={() => goPanel(item.app_id, item.last_release.id)} key={item.app_id}>
              <div className={styles.left}>
                <img src={GinIcon} alt=""/>
              </div>
              <div className={styles.right}>
                <div className={styles.title}>
                  <span>{item.app_name}</span>
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
                </div>
                <div className={styles.status}>
                  Cluster： {cluster && cluster}
                </div>
                <div className={styles.status}>
                  CreatTime： {formatDate(get(item, ['last_release', 'created_at']) * 1000)}
                </div>
                {
                  get(item, ['stack', 'name']) &&
                  <span className={styles.stack}>
                    {get(item, ['stack', 'name'])}
                  </span>
                }
              </div>
            </div>
          )
        })
      }
    </div>
  )
}
