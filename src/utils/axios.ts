import axios, {AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from 'axios';
import cookie from "@/utils/cookie";
import {Message} from "@/utils/utils";
import {get} from "lodash-es";

export const baseURL = process.env.NEXT_PUBLIC_DOMAIN

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
  // All page count
  let pageCount = get(res, ['headers', 'x-page-total'], '');
  // All item count 
  let total = get(res, ['headers', 'x-total-count'], '');
  if ((total !== "") && (pageCount !== "")) {
    return {
      data,
      pagination: {
        total,
        pageCount
      }
    }
  }
  return data;
}, (err) => {
  let {status, data} = err.response;
  if (status === 401) {
    cookie.delCookie('token');
  }
  if (status === 401 && (location.pathname !== '/login')) {
    location.pathname = '/login';
    return;
  }
  let errMsg = data?.msg || data?.err_msg || data;
  errMsg && Message.error(errMsg);
  return Promise.reject(err);
})

export default http;
