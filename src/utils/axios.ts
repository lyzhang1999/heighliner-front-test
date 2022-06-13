import axios, {AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from 'axios';
import cookie from "@/utils/cookie";
import {NoticeRef} from "@/components/Notice";
import {get} from "lodash-es";

export const baseURL = 'http://heighliner-cloud.heighliner.cloud/api/'

export const http = axios.create({
  baseURL: baseURL,
  timeout: 10000,
});

http.interceptors.request.use((config: AxiosRequestConfig) => {
  const token = cookie.getCookie('token');
  if (token) {
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`
  }
  return config
}, err => {
  return Promise.reject(err);
})

http.interceptors.response.use((res: AxiosResponse) => {
  let {data} = res;
  let pageTotal = get(res, ['headers', 'X-Page-Total'], '');
  let pageCount = get(res, ['headers', 'X-Total-Count'], '');
  if ((pageCount !== "") && (pageTotal !== "")) {
    return {
      data,
      pageTotal,
      pageCount
    }
  }
  return data;
}, (err) => {
  let {status, data} = err.response;
  if (status === 401 && (location.pathname !== '/login')) {
    location.pathname = '/login';
    return;
  }
  let errMsg = data?.msg || data?.err_msg || data;
  errMsg && NoticeRef.current?.open({
    message: errMsg,
    type: "error",
  });
  return Promise.reject(err);
})

export default http;
