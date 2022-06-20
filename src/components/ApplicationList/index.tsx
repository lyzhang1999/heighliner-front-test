import styles from "./index.module.scss";
import {ApplicationObject} from "@/utils/api/application";
import {formatDate, getOrganizationNameByUrl} from "@/utils/utils";
import {useRouter} from "next/router";
import {GinIcon} from "@/utils/CDN";
import {get} from "lodash-es";

export default function ApplicationList({list}: { list: ApplicationObject[] }) {
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
          return (
            <div className={styles.item} onClick={() => goPanel(item.app_id, item.last_release.id)} key={item.app_id}>
              <div className={styles.left}>
                <img src={GinIcon} alt=""/>
              </div>
              <div className={styles.right}>
                <div className={styles.title}>
                  {item.app_name}
                  <div className={styles.status}>
                    Status： {item.last_release.status}
                  </div>
                  <div className={styles.status}>
                    CreatTime： {formatDate(get(item, ['last_release','created_at']) * 1000)}
                  </div>
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
