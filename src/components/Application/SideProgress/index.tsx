import clsx from "clsx";

import styles from "./index.module.scss";
import { CommonProps } from "@/utils/commonType";
import { StageIndicator } from "@/pages/[organization]/applications/create";
import { Status } from "@/utils/constants";

interface Props extends CommonProps {
  stageIndicator: StageIndicator;
}

export default function SideProgress({
  stageIndicator,
  className,
}: Props): React.ReactElement {

  return (
    <div className={clsx(styles.sideProgressWrap, className)}>
      <div id="creatingTerminal" className={styles.wrapper}>
        <div className={styles.timeLine}>
          {stageIndicator.stages.map((status, index) => {
            return (
              <div key={index} className={styles.lineItem}>
                <div className={clsx(styles.line)}>
                  {stageIndicator.currentStageIndex >= index && <div className={styles.activeLine}></div>}
                </div>
                <div className={styles.circleWrapper}>
                  <div
                    className={clsx(
                      styles.circlePoint,
                      stageIndicator.currentStageIndex >= index && styles.circlePointDone
                    )}
                  ></div>
                  <div
                    className={clsx(
                      styles.circle,
                      // status === Status.Executing && styles.circleDoing,
                      // status === Status.Success && styles.circleDone
                      stageIndicator.currentStageIndex === index && styles.circleDoing,
                      stageIndicator.currentStageIndex > index && styles.circleDone
                    )}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
