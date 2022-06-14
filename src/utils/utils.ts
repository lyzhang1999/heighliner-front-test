import cookie from "@/utils/cookie";
import {GlobalContxtRef} from "@/components/GlobalContxt";

export function isBrowser() {
  return process.title === "browser";
}

export function getOriIdByContext(): string {
  if (isBrowser()) {
    let result = GlobalContxtRef.current?.getState('currentOrganization');
    if (result) {
      let {org_id} = result;
      return org_id;
    } else {
      return '';
    }
  } else {
    return '';
  }
}

export function getOrganizationNameByUrl(): string {
  if (isBrowser()) {
    let url = location.href;
    let list = url.split('/');
    return encodeURIComponent(list[3]);
  } else {
    return '';
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

export function setLoginToken(value: string) {
  cookie.setCookie('token', value, 1000 * 60 * 60 * 48); // 48h
}

export function formatDate(d: number) {
  var now = new Date(d);
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();
  var hour = now.getHours();
  var minute = now.getMinutes();
  var second = now.getSeconds();
  return year + "/" + month + "/" + date + " " + hour + ":" + minute;
  // return year + "-" + month + "-" + date + " " + hour + ":" + minute + ":" + second;
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

