/**
 * Ditch style tab
 */

import { CommonProps } from "@/utils/commonType";
import { Tab, Tabs } from "@mui/material";
import React, { Dispatch, ReactElement, SetStateAction, useState } from "react";
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
  const [sliderLeft, setSliderLeft] = useState(6);
  const [preSelectedItemIndex, setPreSelectedItemIndex] = useState(0);

  return (
    <div className={styles.wrap}>
      <div className={styles.tabs}>
        <div className={clsx(styles.tab, styles.slider)} style={{left: `${sliderLeft}px`}}></div>
        {tabItems.map(
          ({ label, icon, selectedIcon }, currentSelectedItemIndex) => (
            <div
              key={label}
              className={clsx(
                styles.tab,
                selectedItem === label && styles.selectedItem
              )}
              onClick={() => {
                if (selectedItem !== label) {
                  setSelectedItem(label);
                  const delta = currentSelectedItemIndex - preSelectedItemIndex;
                  setSliderLeft(sliderLeft + delta * 112);
                  setPreSelectedItemIndex(currentSelectedItemIndex);
                }
              }}
            >
              {selectedItem === label ? selectedIcon : icon}
              {label}
            </div>
          )
        )}
      </div>
    </div>
  );
}
