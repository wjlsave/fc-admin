import http from './httpConfig'

export const login = (p,errorMethod) => http.post('login',p,{successMessage:"登录成功"},errorMethod);

export const getuserinfo = () => http.get('getuserinfo');

export const getSysUserpagelist = (p) => http.get('SysUser/pagelist',p);

export const SysUseradd = (p) => http.post('SysUser/add',p,{successMessage:"添加用户成功"});

export const getRolepagelist = (p) => http.get('SysRole/pagelist',p);