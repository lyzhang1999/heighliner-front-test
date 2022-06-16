/**
 * Ditch style tab
 */

import { CommonProps } from "@/utils/commonType";
import { Tab, Tabs } from "@mui/material";
import React, { Dispatch, ReactElement, SetStateAction } from "react";
import clsx from "clsx";

import styles from "./index.module.scss";

export type TabItems<LabelSet extends React.Key> = Array<{
  label: LabelSet;
  icon?: ReactElement;
  selectedIcon?: ReactElement;
}>;

interface Props<LabelSet extends React.Key> extends CommonProps {
  tabItems: TabItems<LabelSet>;
  selectedItem: LabelSet;
  setSelectedItem: Dispatch<SetStateAction<LabelSet>>;
}

export default function DitchTab<LabelSet extends React.Key>({
  tabItems,
  selectedItem,
  setSelectedItem,
}: Props<LabelSet>): React.ReactElement {
  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        {tabItems.map(({ label, icon, selectedIcon }) => (
          <div
            key={label}
            className={clsx(
              styles.tab,
              selectedItem === label && styles.selectedItem
            )}
            onClick={() => {
              selectedItem !== label && setSelectedItem(label);
            }}
          >
            {selectedItem === label ? selectedIcon : icon}
            {label}
          </div>
        ))}
      </div>
    </div>
  );
}
