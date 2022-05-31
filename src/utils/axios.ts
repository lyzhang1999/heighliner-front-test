import axios, {AxiosRequestConfig, AxiosRequestHeaders, AxiosResponse} from 'axios';
import cookie from "@/utils/cookie";
import {NoticeRef} from "@/components/Notice";

export const http = axios.create({
  baseURL: 'http://heighliner-cloud.heighliner.cloud/api/',
  timeout: 10000,
});

http.interceptors.request.use((config: AxiosRequestConfig) => {
  // 发生请求前的处理
  const token = cookie.getCookie('token');
  if (token) {
    (config.headers as AxiosRequestHeaders).Authorization = `Bearer ${token}`
  }
  return config
}, err => {
  // 请求错误处理
  return Promise.reject(err);
})

http.interceptors.response.use((res: AxiosResponse) => {
  //请求成功对响应数据做处理
  let {data} = res;
  return data //该返回对象会传到请求方法的响应对象中
}, err => {
  // 响应错误处理
  let errMsg = err?.response?.data?.err_msg;
  console.error(errMsg)
  NoticeRef.current?.open({
    message: errMsg,
    type: "error",
  });
  return Promise.reject(err);
})

export default http;
