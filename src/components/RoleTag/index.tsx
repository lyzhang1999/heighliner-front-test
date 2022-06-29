import styles from "./index.module.scss";
import clsx from "clsx";
import {MemberType,} from "@/utils/api/org";

export default function RoleTag({type}: { type: MemberType }) {
  if (type === "Owner") {
    return (
      <span className={clsx(styles.basic, styles.owner)}>
        Owner
      </span>
    )
  }
  if (type === 'Admin') {
    return (
      <span className={clsx(styles.basic, styles.admin)}>
        Admin
      </span>
    )
  }
  if (type === 'Member') {
    return (
      <span className={clsx(styles.basic, styles.member)}>
        Member
      </span>
    )
  }
  return (<></>)
}
