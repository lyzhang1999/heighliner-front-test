import React, { MouseEventHandler, ReactElement, useState } from "react";
import { Control } from "react-hook-form";
import clsx from "clsx";

import { CommonProps } from "@/utils/commonType";

import styles from "./index.module.scss";
import Image from "next/image";

export type CardItems = Array<{
  name: string;
  icon: string | ReactElement;
  iconSettings?: {
    leftLayout?: boolean;
    width?: number | string;
    height?: number | string;
  };
  customClick?: MouseEventHandler;
  blueBackgroundItem: boolean;
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
          onClick={(e) => {
            if (card.customClick) {
              card.customClick(e);
              return;
            }
            setChosen(card.name);
          }}
          style={(() => {
            const style = {};
            const flexDirection =
              card.iconSettings && card.iconSettings.leftLayout
                ? "row"
                : "column";
            return {
              flexDirection,
            };
          })()}
        >
          {typeof card.icon === "string" ? (
            <div
              style={{
                position: "relative",
                width: (card.iconSettings && card.iconSettings.width) || 45,
                height: (card.iconSettings && card.iconSettings.height) || 45,
              }}
            >
              <Image src={card.icon} alt="" layout="fill" objectFit="contain" />
            </div>
          ) : (
            <>{card.icon}</>
          )}
          <span className={styles.name}>{card.name}</span>
        </li>
      ))}
    </ul>
  );
}
