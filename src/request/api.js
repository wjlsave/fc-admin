import http from './httpConfig'

export const login = (p,errorMethod) => http.post('login',p,{successMessage:"登录成功"},errorMethod);

export const getUserinfo = () => http.get('getuserinfo');

export const getSysUserPagelist = (p) => http.get('SysUser/pagelist',p);

export const SysUserAdd = (p) => http.post('SysUser/add',p,{successMessage:"添加用户成功"});

export const SysUserEdit = (p) => http.post('SysUser/edit',p,{successMessage:"修改用户成功"});

export const SysUserCut = (p) => http.post('SysUser/cut',p,{successMessage:"删除用户成功"});

export const getRolePagelist = (p) => http.get('SysRole/pagelist',p);