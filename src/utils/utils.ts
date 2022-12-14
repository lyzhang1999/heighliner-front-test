import {GlobalContxtRef} from "@/components/GlobalContxt";
import {IOpen, NoticeRef} from "@/components/Notice";
import {OrgList, roleType} from "@/api/org";
import {find} from "lodash-es";
import {OrganizationType} from "@/utils/store";
import {UserInfo} from "@/api/profile";
import dayjs from "dayjs";
import {setToken} from "@/utils/token";

export function isBrowser() {
  return process.title === "browser";
}

export function getStateByContext(arr: string[]) {
  let result = GlobalContxtRef.current?.getState(arr);
  if (isBrowser()) {
    return result;
  } else {
    return '';
  }
}

export function getOriIdByContext(): string {
  let result = GlobalContxtRef.current?.getState(['currentOrganization']);
  if (isBrowser() && result) {
    let {org_id} = result;
    return org_id;
  } else {
    return '';
  }
}

export function getOriNameByContext(): string {
  let result = GlobalContxtRef.current?.getState(['currentOrganization']);
  if (isBrowser() && result) {
    let {name} = result;
    return name;
  } else {
    return '';
  }
}

export function getOrganizationNameByUrl(): string {
  if (isBrowser()) {
    let url = location.href;
    let list = url.split('/');
    return decodeURIComponent(list[3]);
  } else {
    return '';
  }
}

export function getUrlEncodeName(): string {
  return encodeURIComponent(getOrganizationNameByUrl());
}

export function getUserInfo(): UserInfo | null {
  let result = GlobalContxtRef.current?.getState(['userInfo']);
  if (isBrowser() && result) {
    return result;
  } else {
    return null;
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

export function setLoginToken(value: string, expiration?: number) {
  let exTime = 1000 * 60 * 60 * 48; // 48 hours by default
  if (expiration !== undefined) {
    const delta = expiration - Date.now();
    delta >= 0 && (exTime = delta);
  }
  setToken(value);
  // cookie.setCookie('token', value, exTime);
}

export function formatDate(d: number) {
  return dayjs(d).format('YYYY-MM-DD HH:mm');
}

export function getQuery(variable: string): string {
  if (!isBrowser()) {
    return "";
  }
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");
    if (pair[0] == variable) {
      return pair[1];
    }
  }
  return "";
}

export function fileToBase64(file: File) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  });
}

export const Message = {
  success: function (str: string, options?: IOpen['options']) {
    NoticeRef.current?.open({
      message: str,
      type: "success",
      options,
    });
  },
  error: function (str: string, options?: IOpen['options']) {
    NoticeRef.current?.open({
      message: str,
      type: "error",
      options,
    });
  },
  info: function (str: string, options?: IOpen['options']) {
    NoticeRef.current?.open({
      message: str,
      type: "info",
      options,
    });
  },
  warning: function (str: string, options?: IOpen['options']) {
    NoticeRef.current?.open({
      message: str,
      type: "warning",
      options,
    });
  }
}

export function getCurrentOrg(organization: OrgList): OrganizationType {
  let {id, name, type} = organization;
  let {org_id, member_type, updated_at, created_at, status, user_id} = organization.member;
  return {
    created_at,
    id,
    member_type,
    org_id,
    updated_at,
    user_id,
    name,
    status,
    type
  };
}

/**
 * User initial organization when sign in into ForkMain.
 */
export function parseInitialDefaultOrg(orgList: OrgList[] | undefined): OrgList {
  let defaultOrg = find(orgList, {type: "Default", member: {member_type: roleType.Owner}});
  return defaultOrg as OrgList;
}

/**
 * @Deprecated Please use parseInitialDefaultOrg instead if you want to get initial default organization.
 * To invoke getUserInfo api to get the user info which have default organization set by user.
 */
export function getDefaultOrg(orgList: OrgList[] | undefined): OrgList {
  let defaultOrg = find(orgList, {type: "Default", member: {member_type: roleType.Owner}});
  return defaultOrg as OrgList;
}

export function isProduct() {
  return location.host === "forkmain.com";
}
