import { baseURL, pluginURL, releasesURL } from '../../constants/url';
import httpClient from '../httpClient';
import request from 'request';
import progress from 'request-progress';

import axios, { AxiosRequestConfig, Method } from 'axios';
import { ResponseData, PluginList, Http, HttpMethod } from './type';

const axiosInstance = axios.create({
  baseURL
});

const httpInstance: Http = {};

const httpCoreFn: HttpMethod = async <T>(url: string, options?: AxiosRequestConfig): Promise<T> => {
  const result = await axiosInstance({
    url,
    ...options
  });

  const resultData: ResponseData<T> = result.data;

  return resultData.data;
};

['get', 'post', 'delete', 'update'].forEach((method: Method) => {
  httpInstance[method] = <T>(url: string, options?: AxiosRequestConfig) => httpCoreFn<T>(url, options);
});

/**
 * 获取商店的插件列表
 * @returns
 */
function getPluginList(): Promise<PluginList> {
  return httpInstance.get<PluginList>(`${pluginURL}/list`);
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
