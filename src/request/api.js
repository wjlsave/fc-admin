import http from './httpConfig'

export const login = (p,errorMethod) => http.post('login',p,{successMessage:"登录成功"},errorMethod);

export const getuserinfo = () => http.get('getuserinfo');