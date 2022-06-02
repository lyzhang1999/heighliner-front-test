import { Input, InputLabel, TextField, Typography } from "@mui/material";

import { CommonProps } from "@/utils/commonType";
import SubTitle from "../SubTitle";

interface Props extends CommonProps {}

const stacks = ["Gin-Next", "Spring-Vue", "Gin-Vue", "Remix"];

export default function BasicApplicationInfo({
  style,
}: Props): React.ReactElement {
  return (
    <div style={style}>
      <SubTitle variant="h5" require>Application Name</SubTitle>
      <Typography variant="h5" >Application Name</Typography>
      <InputLabel />
      <TextField variant="outlined" />
      <Typography variant="h5">Cluster</Typography>
      <TextField variant="outlined" />
      <Typography variant="h5">Cluster</Typography>
      <ul>
        {stacks.map((stack, index) => {
          return <li key={index}>{stack}</li>;
        })}
      </ul>
    </div>
  );
}
