import axios, {AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from 'axios';
import cookie from "@/utils/cookie";
import {NoticeRef} from "@/components/Notice";

export const http = axios.create({
  baseURL: 'http://heighliner-cloud.heighliner.cloud/api/',
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
  return data
}, (err) => {
  let {status, data} = err.response;
  if (status === 401 && (location.pathname !== '/login')) {
    location.pathname = '/login';
    return;
  }
  let errMsg = data?.err_msg || data;
  errMsg && NoticeRef.current?.open({
    message: errMsg,
    type: "error",
  });
  return Promise.reject(err);
})

export default http;
