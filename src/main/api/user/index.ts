import { userURL } from '../../constants/url';
import httpClient from '../httpClient';

/**
 * 注册账号
 * @param data
 * @returns
 */
function register(data: unknown): Promise<any> {
  return httpClient.post(`${userURL}/register`, { data });
}

/**
 * 登录账号
 * @param data
 * @returns
 */
function login(data: unknown): Promise<any> {
  return httpClient.post(`${userURL}/login`, { data });
}

export { register, login };
