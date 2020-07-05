import {get,post} from './http'

export const login = (p) => post('login',p);

export const getuserinfo = () => get('getuserinfo');