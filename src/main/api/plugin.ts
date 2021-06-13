import { baseURL } from '../constants/url';
import httpClient from './httpClient';

const pluginListURL = `${baseURL}/plugin/list`;

/**
 * 获取商店的插件列表
 * @returns
 */
function getPluginList(): Promise<any> {
  return httpClient.get(pluginListURL);
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

export { getPluginList, downloadPlugin };
