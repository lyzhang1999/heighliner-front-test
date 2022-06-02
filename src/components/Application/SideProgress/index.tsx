import clsx from "clsx";


import styles from "./index.module.scss";
import { CommonProps } from "@/utils/commonType";
import { StageIndicator } from "@/pages/[organization]/applications/create";

interface Props extends CommonProps{
  stageIndicator: StageIndicator;
}

export default function SideProgress({
  stageIndicator,
  className
}: Props): React.ReactElement {
  return (
    <div className={clsx(styles.sideProgressWrap, className)}>
      <ul>
        {stageIndicator.stages.map((status, index) => {
          return <li key={index}>{status}</li>;
        })}
      </ul>
    </div>
  );
}
