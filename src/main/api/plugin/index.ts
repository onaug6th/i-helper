import { pluginURL, releasesURL } from '../../constants/url';
import httpClient from '../httpClient';
import request from 'request';
import progress from 'request-progress';
import { PluginList, Releases } from './types';
import { Readable } from 'stream';
import pluginListData from './pluginList';

/**
 * 获取商店的插件列表
 * @returns
 */
async function getPluginList(): Promise<PluginList> {
  // 感谢下载。但服务下线了，现在只能用写死的数据了 :)
  // 如果你需要真实的数据，可以下载i-helper的配套后端代码。连接本地启动的后端服务
  // return httpClient.get<PluginList>(`${pluginURL}/list`);
  return pluginListData;
}

/**
 * 根据id下载插件
 * @param url
 * @returns
 */
function downloadPlugin(url: string): Promise<Readable> {
  return httpClient.get(url, {
    responseType: 'stream'
  });
}

/**
 * 根据id获取商店插件详情
 * @param id
 * @returns
 */
function getPlugin(id: string): Promise<TPlugin> {
  return httpClient.get(`${pluginURL}/${id}`);
}

/**
 * 获取最新应用版本信息
 * @returns
 */
function getReleases(): Promise<Releases> {
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
function downloadIncrease(id: string): Promise<void> {
  return httpClient.put(`${pluginURL}/downloads/${id}`);
}

export { getPluginList, downloadPlugin, getPlugin, getReleases, getInstallPackage, downloadIncrease };
