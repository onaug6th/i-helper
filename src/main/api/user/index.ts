import { userURL } from '../../constants/url';
import httpClient from '../httpClient';
/**
 * 注册账号
 * @param data
 * @returns
 */
function register(data: unknown): Promise<any> {
  return httpClient.post(`${userURL}`, { data });
}

export { register };
