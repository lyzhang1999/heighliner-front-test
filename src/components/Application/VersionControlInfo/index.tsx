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
import { ChangeEvent, useState } from "react";
import http from "@/utils/axios";
import { getOriginzationByUrl } from "@/utils/utils";
import { getGitHubTokenList, TokenList } from "@/utils/api/githubToken";

interface Props extends CommonProps, FormReducerReturnType {}

export default function VersionControllInfo({
  formData,
  formDataDispatch,
}: Props): React.ReactElement {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [tokenList, setTokenList] = useState<TokenList>([]);

  const changeHandler = (
    event:
      | SelectChangeEvent<string>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (event.target.value === "new") {
      setModalDisplay(true);
    } else {
      formDataDispatch({
        type: FieldChangeType.TextInput,
        field: event.target.name,
        payload: event.target.value,
      });
    }
  };

  const openHandler = () => {
    getGitHubTokenList().then((res) => {
      setTokenList(res);
    });
  };

  return (
    <>
      <SubTitle variant="h5" require={true}>
        Git Provider
      </SubTitle>
      <Select
        value={formData[AllFieldName.GitHubToken]}
        onChange={changeHandler}
        onOpen={openHandler}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        name={AllFieldName.GitHubToken}
      >
        {tokenList.map((token) => (
          <MenuItem key={token.id} value={token.name}>
            {token.name}
          </MenuItem>
        ))}
        <MenuItem value={"new"}>
          <AddCircleOutlineIcon />
          &nbsp; Add
        </MenuItem>
      </Select>
      <SubTitle variant="h5" require={true}>
        Domain
      </SubTitle>
      <TextField
        value={formData[AllFieldName.Domain]}
        onChange={changeHandler}
        name={AllFieldName.Domain}
      />
      <NewGitHubToken
        modalDisplay={modalDisplay}
        setModalDisplay={setModalDisplay}
      />
    </>
  );
}
