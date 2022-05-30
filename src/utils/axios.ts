import axios from 'axios';


export const http = axios.create({
  baseURL: 'http://heighliner-cloud.heighliner.cloud/api/',
  timeout: 10000,
  headers: {'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJoZWlnaGxpbmVyLWNsb3VkLWJhY2tlbmQiLCJleHAiOjE2NTM2MzkyMTYsImlhdCI6MTY1MzYzOTIxNiwidXNlcl9pZCI6MSwibG9naW5fdHlwZSI6ImdpdGh1YiJ9.O4bsVPvSDD6nChqw28TM758X0NbxfOve2vFpLz0fie8'}
});

http.interceptors.request.use(config=>{
  // 发生请求前的处理
  // let {data} = config
  return config
},err=>{
  // 请求错误处理
  return Promise.reject(err);
})

http.interceptors.response.use(res=>{
  //请求成功对响应数据做处理
  let {data} = res;
  return data //该返回对象会传到请求方法的响应对象中
},err=>{
  // 响应错误处理
  return Promise.reject(err);
})

http.get('/health').then(res => {
  console.warn(res)
}).catch(e => {
  console.warn(e)
})
