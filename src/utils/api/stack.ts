import http from "../axios";
import { CreativeApiReturnField } from "../commonType";

export interface Stack extends CreativeApiReturnField{
  id: number;
  name: string;
  url: string;
  version: string;
}

export type Stacks = Stack[];

export function getStacks(): Promise<Stacks> {
  return http.get(`/stacks`);
}
