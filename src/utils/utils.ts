import {find} from 'lodash-es';

export function isBrowser() {
  return process.title === "browser";
}

export function getOriginzationByUrl() {
  if (isBrowser()) {
    let url = location.href;
    let list = url.split('/');
    return encodeURIComponent(list[3]);
  }
}

interface ResultType {
  created_at: number,
  id: number,
  member: any[],
  name: string,
  updated_at: number
}

export function judgeCurrentOri(list: ResultType[]): Boolean {
  let currentItem = find(list, {id: Number(getOriginzationByUrl())});
  return Boolean(currentItem);
}

const utils = {
  getOriginzationByUrl,
  isBrowser,
  judgeCurrentOri
}

export default utils;
