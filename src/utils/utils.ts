import {find} from 'lodash-es';
import cookie from "@/utils/cookie";

export function isBrowser() {
  return process.title === "browser";
}

export function getOrganizationByUrl() {
  if (isBrowser()) {
    let url = location.href;
    let list = url.split('/');
    return encodeURIComponent(list[3]);
  }
}

export function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 36; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] as string & 0x3) | 0x8, 1)
  s[8] = s[13] = s[18] = s[23] = '-'
  var uuid = s.join('')
  return uuid
}

interface ResultType {
  created_at: number,
  id: number,
  member: any[],
  name: string,
  updated_at: number
}

export function judgeCurrentOri(list: ResultType[]): Boolean {
  let currentItem = find(list, {id: Number(getOrganizationByUrl())});
  return Boolean(currentItem);
}

export function setLoginToken(value: string){
  cookie.setCookie('token', value, 1000 * 60 * 60 * 48); // 48h
}

const utils = {
  getOrganizationByUrl,
  isBrowser,
  judgeCurrentOri,
  uuid
}

export default utils;
