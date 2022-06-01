import { Input, InputLabel, TextField, Typography } from "@mui/material";

export default function BasicApplicationInfo(): React.ReactElement {
  return (
    <>
      <Typography variant="h5">Application Name</Typography>
      <InputLabel />
      <TextField variant="outlined" />
      <Typography variant="h5">Cluster</Typography>
      <Input />
    </>
  );
}
