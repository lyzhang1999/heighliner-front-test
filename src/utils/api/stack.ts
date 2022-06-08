import http from "../axios";

export interface Stack {
  created_at: number;
  id: number;
  name: string;
  updated_at: number;
  url: string;
  version: string;
}

export type Stacks = Stack[];

export function getStacks(): Promise<Stacks> {
  return http.get(`/stacks`);
}
