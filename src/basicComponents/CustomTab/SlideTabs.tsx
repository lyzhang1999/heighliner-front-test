import { TabContext, TabList, TabPanel } from "@mui/lab";
import React, { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CommonProps } from "@/utils/commonType";
import { Tab } from "@mui/material";
import { styled } from "@mui/material/styles";

interface Props<LabelType extends string = string> extends CommonProps {
  tabItems: Array<{
    label: LabelType;
  }>;
  selectedTab: LabelType;
  setSelectedTab: Dispatch<SetStateAction<LabelType>>;
}

interface StyledTabListProps {
  children?: React.ReactNode;
  onChange: (event: React.SyntheticEvent, newValue: string) => void;
}
const SlideTabList = styled((props: StyledTabListProps) => (
  <TabList
    {...props}
    TabIndicatorProps={{ children: <span className="MuiTabs-indicatorSpan" /> }}
  />
))({
  "&.MuiTabs-root": {
    minHeight: 26,
  },
  "& .MuiTabs-flexContainer": {
    position: "relative",
    zIndex: "1",
  },
  "& .MuiTabs-indicator": {
    height: "100%",
    display: "flex",
    justifyContent: "center",
    backgroundColor: "transparent",
  },
  "& .MuiTabs-indicatorSpan": {
    width: "100%",
    backgroundColor: "#70809f",
    borderRadius: 7,
  },
});

interface StyledTabProps {
  label: string;
  value: string;
}
const SlideTab = styled((props: StyledTabProps) => (
  <Tab disableRipple {...props} />
))({
  width: 112,
  height: 26,
  minHeight: 26,
  textTransform: "capitalize",
  color: "#202f40",
  transition: "color 300ms cubic-bezier(0.4, 0, 0.2, 1) 0ms",
  "&.Mui-selected": {
    color: "white",
  },
});

export default function SlideTabs<LabelType extends string = string>({
  tabItems,
  selectedTab,
  setSelectedTab,
}: Props<LabelType>): React.ReactElement {
  return (
    <TabContext value={selectedTab}>
      <SlideTabList
        onChange={(e, n) => {
          console.log(n);
          setSelectedTab(n as LabelType);
        }}
      >
        {tabItems.map((tabItem, index) => (
          <SlideTab
            label={tabItem.label}
            value={tabItem.label}
            key={index}
          ></SlideTab>
        ))}
      </SlideTabList>
      <TabPanel value="a">aaa</TabPanel>
      <TabPanel value="b">bbb</TabPanel>
      <TabPanel value="c">ccc</TabPanel>
    </TabContext>
  );
}
