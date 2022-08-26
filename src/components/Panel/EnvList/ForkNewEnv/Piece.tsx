import { CommonProps } from "@/utils/commonType";
import styled from "@emotion/styled";
import { Tooltip, Typography, TypographyProps } from "@mui/material";

export const HeadlineOne = styled(Typography)<TypographyProps>(() => ({
  fontSize: 15,
  fontWeight: 500,
  fontFamily: "Roboto",
}));

/**
 * @Deprecated Use <HeadTitle2 /> instead.
 */
export const HeadlineTwo = styled(Typography)<TypographyProps>(() => ({
  fontSize: 14,
  fontFamily: "Roboto",
  color: "#5b7587",
  width: "100%",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
}));

interface Props extends CommonProps {
  toolTipTitle?: string;
}

export const HeadTitle2 = ({ toolTipTitle, children }: Props) => (
  <Typography
    sx={{
      fontSize: 14,
      fontFamily: "Roboto",
      color: "#5b7587",
      width: "100%",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
      display: "inline-block",
    }}
  >
    <Tooltip title={toolTipTitle ?? ""}>
      <span>{children}</span>
    </Tooltip>
  </Typography>
);
