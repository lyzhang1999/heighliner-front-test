import styles from "./index.module.scss";
import {ApplicationObject} from "@/utils/api/application";
import {getOrganizationNameByUrl} from "@/utils/utils";
import {useRouter} from "next/router";

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
              {item.app_name}
            </div>
          )
        })
      }
    </div>
  )
}
