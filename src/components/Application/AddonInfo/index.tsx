import {
  Checkbox,
  FormControlLabel,
  FormGroup,
  Typography,
} from "@mui/material";
import SubTitle from "../SubTitle";

export default function AddonInfo(): React.ReactElement {
  return (
    <>
      <SubTitle variant="h5" require={true}>
        Repos
      </SubTitle>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label={"Frontend: frontend: https://github.com/xxx/yyy-front"}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label={"Frontend: frontend: https://github.com/xxx/yyy-front"}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label={"Frontend: frontend: https://github.com/xxx/yyy-front"}
        />
      </FormGroup>
      <SubTitle variant="h5" require={true}>
        Addons
      </SubTitle>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label={"Argocd"}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label={"Grafana"}
        />
        <FormControlLabel
          control={<Checkbox defaultChecked />}
          label={"Nocalhost"}
        />
      </FormGroup>
    </>
  );
}
