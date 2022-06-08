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
  GitConfig,
} from "../formData";
import SubTitle from "../SubTitle";
import NewGitHubToken from "./NewGitHubToken";
import { ChangeEvent, useEffect, useState } from "react";
import http from "@/utils/axios";
import { getOriginzationByUrl } from "@/utils/utils";
import { getGitHubTokenList, TokenList } from "@/utils/api/githubToken";

interface Props extends CommonProps, FormReducerReturnType {}

export default function VersionControllInfo({
  formData,
  formDataDispatch,
}: Props): React.ReactElement {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [gitTokenList, setGitTokenList] = useState<TokenList>([]);

  const changeHandler = (
    event:
      | SelectChangeEvent<string>
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (+event.target.value === -99) {
      setModalDisplay(true);
    } else {
      formDataDispatch({
        type: FieldChangeType.TextInput,
        field: event.target.name,
        payload: event.target.value,
      });
    }
  };

  const chooseGitHandler = (event: SelectChangeEvent<string>) => {
    const chosenGitToken = gitTokenList.find(
      (gitToken) => gitToken.id === +event.target.value
    );
    const gitConfig: GitConfig = {
      [AllFieldName.OrgName]: chosenGitToken!.github_org_name,
      [AllFieldName.GitProvider]: chosenGitToken!.provider,
      [AllFieldName.GitToken]: chosenGitToken!.token,
    };
    console.log(gitConfig);

    formDataDispatch({
      type: FieldChangeType.Git,
      field: AllFieldName.GitConfig,
      payload: gitConfig,
    });
  };

  const openHandler = () => {
    getGitHubTokenList().then((res) => {
      setGitTokenList(res);
    });
  };

  useEffect(() => {
    getGitHubTokenList().then((res) => {
      setGitTokenList(res);
    });
  }, []);

  useEffect(() => {
    getGitHubTokenList().then((res) => {
      setGitTokenList(res);
    });
  }, [modalDisplay]);

  return (
    <>
      <SubTitle variant="h5" require={true}>
        Git Provider
      </SubTitle>
      <Select
        value={formData[AllFieldName.GitConfig][AllFieldName.GitToken]}
        onChange={chooseGitHandler}
        onOpen={openHandler}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        name={AllFieldName.GitHubToken}
        style={{ minWidth: 195 }}
      >
        {gitTokenList.map(({ token, id }) => (
          <MenuItem key={token} value={id}>
            {token}
          </MenuItem>
        ))}
        <MenuItem value={-99}>
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
