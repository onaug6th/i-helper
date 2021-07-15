import { baseURL, pluginURL } from '../../constants/url';
import httpClient from '../httpClient';
import request from 'request';
import progress from 'request-progress';

/**
 * 获取商店的插件列表
 * @returns
 */
function getPluginList(): Promise<Array<StorePlugin>> {
  return httpClient.get(`${baseURL}/plugin/list`);
}

/**
 * 根据id下载插件
 * @param url
 * @returns
 */
function downloadPlugin(url: string): Promise<any> {
  return httpClient.get(url, {
    responseType: 'stream'
  });
}

/**
 * 根据id获取商店插件详情
 * @param id
 * @returns
 */
function getPlugin(id: string): Promise<StorePlugin> {
  return httpClient.get(`${pluginURL}/${id}`);
}

/**
 * 获取最新应用版本信息
 * @returns
 */
function getLatestVersionInfo(): Promise<any> {
  return httpClient.get('https://gitee.com/api/v5/repos/onaug6th/i-helper/releases/latest');
}

/**
 * 获取更新包
 * @param url
 * @returnsw
 */
function getInstallPackage(url: string): any {
  return progress(request(url), {
    throttle: 1000
  });
}

export { getPluginList, downloadPlugin, getPlugin, getLatestVersionInfo, getInstallPackage };
