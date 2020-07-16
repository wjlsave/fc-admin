import http from './httpConfig'

export const login = (p,errorMethod) => http.post('login',p,{successMessage:"登录成功"},errorMethod);

export const getUserinfo = () => http.get('getuserinfo');

export const getSysUserPagelist = (p) => http.get('SysUser/pagelist',p);

export const SysUserDetail = (p) => http.get('SysUser/detail',p);

export const SysUserCut = (p) => http.post('SysUser/cut',p,{successMessage:"删除用户成功"});

export const SysUserAdd = (p) => http.post('SysUser/add',p,{successMessage:"添加用户成功"});

export const SysUserEdit = (p) => http.post('SysUser/edit',p,{successMessage:"修改用户成功"});

export const SysUserResetPassword = (p) => http.post('SysUser/resetpassword',p,{successMessage:"重置密码成功"});

export const getSysRolePagelist = (p) => http.get('SysRole/pagelist',p);

export const SysRoleDetail = (p) => http.get('SysRole/detail',p);

export const SysRoleCut = (p) => http.post('SysRole/cut',p,{successMessage:"删除角色成功"});

export const SysRoleAdd = (p) => http.post('SysRole/add',p,{successMessage:"添加角色成功"});

export const SysRoleEdit = (p) => http.post('SysRole/edit',p,{successMessage:"修改角色成功"});

export const getSysResourceTreelist = (p) => http.get('SysResource/treelist',p);

export const SysResourceDetail = (p) => http.get('SysResource/detail',p);

export const SysResourceCut = (p) => http.post('SysResource/cut',p,{successMessage:"删除资源成功"});

export const SysResourceAdd = (p) => http.post('SysResource/add',p,{successMessage:"添加资源成功"});

export const SysResourceEdit = (p) => http.post('SysResource/edit',p,{successMessage:"修改资源成功"});

export const SysResourceTreeDrag = (p) => http.post('SysResource/treedrag',p,{successMessage:"修改位置成功"});

export const getSysResourceOfUser = (p,errorMethod) => http.get('SysResource/getuserresource',p,errorMethod);

export const getSysApiPagelist = (p) => http.get('SysApi/pagelist',p);

export const SysApiDetail = (p) => http.get('SysApi/detail',p);

export const SysApiCut = (p) => http.post('SysApi/cut',p,{successMessage:"删除接口成功"});

export const SysApiAdd = (p) => http.post('SysApi/add',p,{successMessage:"添加接口成功"});

export const SysApiEdit = (p) => http.post('SysApi/edit',p,{successMessage:"修改接口成功"});