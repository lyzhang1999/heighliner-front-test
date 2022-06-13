/**
 * Menu has nested menu item.
 */

import React, { ReactElement } from "react";

interface Menu {
  icon?: ReactElement;
  title: string;
  to?: string;
  items: Menu[];
}

interface Props {
  menuList: Menu[];
}

export default function NestedMenu({ menuList }: Props): React.ReactElement {
  return (
    <>
      {menuList.map((menu) => {
        // Have multiple sub-items
        if (menu.items && menu.items.length > 0) {
          return (
            <div>
              <NestedMenu menuList={menu.items} />
            </div>
          );
        } else {
        }
      })}
    </>
  );
}
