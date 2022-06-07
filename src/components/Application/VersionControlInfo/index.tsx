import {
  FormControl,
  FormHelperText,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";

import { CommonProps } from "@/utils/commonType";

import {
  AllFieldName,
  FieldChangeType,
  FormReducerReturnType,
} from "../formData";
import SubTitle from "../SubTitle";
import NewGitHubToken from "./NewGitHubToken";
import { useState } from "react";
import http from "@/utils/axios";
import { getOriginzationByUrl } from "@/utils/utils";

interface Props extends CommonProps, FormReducerReturnType {}

interface Token {
  created_at: number;
  github_org_name: string;
  id: number;
  name: string;
  org_id: number;
  provider: string;
  token: string;
  updated_at: number;
}

type TokenList = Token[];

export default function VersionControllInfo({
  formData,
  formDataDispatch,
}: Props): React.ReactElement {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [tokenList, setTokenList] = useState<TokenList>([]);

  const changeHandler = (event: SelectChangeEvent<string>) => {
    if (event.target.value === "new") {
      setModalDisplay(true);
    } else {
      formDataDispatch({
        type: FieldChangeType.TextInput,
        field: AllFieldName.GitHubToken,
        payload: event.target.value,
      });
    }
  };

  const openHandler = () => {
    http.get(`/orgs/${getOriginzationByUrl()}/git_tokens`).then((res) => {
      setTokenList(res as TokenList);
    });
  };

  return (
    <>
      <SubTitle variant="h5" require={true}>
        GitHub Token
      </SubTitle>
      <FormControl sx={{ m: 1, minWidth: 120 }}>
        <Select
          value={formData[AllFieldName.GitHubToken]}
          onChange={changeHandler}
          onOpen={openHandler}
          displayEmpty
          inputProps={{ "aria-label": "Without label" }}
        >
          {tokenList.map((token) => (
            <MenuItem key={token.id} value={token.name}>
              {token.name}
            </MenuItem>
          ))}
          <MenuItem value={"new"}>
            {/* <div
              onClick={() => {
                setModalDisplay(true);
              }}
            > */}
            <AddCircleOutlineIcon />
            &nbsp; Add
            {/* </div> */}
          </MenuItem>
        </Select>
        <FormHelperText>Without label</FormHelperText>
      </FormControl>
      <NewGitHubToken
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
      />
    </>
  );
}
