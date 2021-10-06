import { baseURL, pluginURL, releasesURL } from '../../constants/url';
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
function getReleases(): Promise<Array<any>> {
  return httpClient.get(releasesURL);
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

/**
 * 更新插件下载量
 * @param id
 * @returns
 */
function downloadIncrease(id: string): Promise<any> {
  return httpClient.put(`${pluginURL}/downloads/${id}`);
}

export { getPluginList, downloadPlugin, getPlugin, getReleases, getInstallPackage, downloadIncrease };
