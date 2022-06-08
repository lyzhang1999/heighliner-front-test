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
import { createApplication } from "@/utils/api/application";

interface Props extends CommonProps, FormReducerReturnType {}

export default function VersionControllInfo({
  formData,
  formDataDispatch,
}: Props): React.ReactElement {
  const [modalDisplay, setModalDisplay] = useState<boolean>(false);
  const [gitTokenList, setGitTokenList] = useState<TokenList>([]);
  const [chosenGitTokenId, setChosenGitTokenId] = useState("");

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
    if (+event.target.value === -99) {
      setModalDisplay(true);
      return;
    }

    const chosenGitToken = gitTokenList.find(
      (gitToken) => gitToken.id === +event.target.value
    );
    const gitConfig: GitConfig = {
      [AllFieldName.OrgName]: chosenGitToken!.git_org_name,
      [AllFieldName.GitProvider]: chosenGitToken!.provider,
      [AllFieldName.GitToken]: chosenGitToken!.token,
    };

    formDataDispatch({
      type: FieldChangeType.Git,
      field: AllFieldName.GitConfig,
      payload: gitConfig,
    });

    setChosenGitTokenId(event.target.value);

  };

  useEffect(() => {
    getGitHubTokenList().then((res) => {
      setGitTokenList(res);
      console.log(res);
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
        // value={showChosenGitToken}
        value={chosenGitTokenId}
        onChange={chooseGitHandler}
        displayEmpty
        inputProps={{ "aria-label": "Without label" }}
        name={AllFieldName.GitConfig}
        style={{ minWidth: 195 }}
      >
        {gitTokenList.map(({ token, id, git_org_name }) => (
          <MenuItem key={token} value={id}>
            {git_org_name + ":" + token}
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
