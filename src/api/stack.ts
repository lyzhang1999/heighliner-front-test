import http from "../utils/axios";
import { CreativeApiReturnField } from "../utils/commonType";

export interface Stack extends CreativeApiReturnField {
  id: number;
  name: string;
  icon_urls: Array<string>;
  url: string;
  version: string;
}

export type Stacks = Stack[];

export function getStacks(): Promise<Stacks> {
  return http.get(`/stacks`);
}
