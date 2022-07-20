import React, { useState } from "react";
import { Control } from "react-hook-form";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";

export type CardItems = Array<{
  icon: string;
  name: string;
}>;

interface Props extends CommonProps {
  cardItems: CardItems;
  control: Control;
  name: string;
}

export default function CardSelect(props: Props): React.ReactElement {
  const [chosen, setChosen] = useState("");

  return (
    <ul className={styles.wrapper}>
      {props.cardItems.map((card) => (
        <li
          key={card.name}
          className={clsx(card.name === chosen && styles.chosen)}
          onClick={() => {
            setChosen(card.name);
          }}
        >
          <span className={styles.name}>{card.name}</span>
        </li>
      ))}
    </ul>
  );
}
