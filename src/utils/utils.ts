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

const utils = {
  getOriginzationByUrl,
  isBrowser
}

export default utils;
