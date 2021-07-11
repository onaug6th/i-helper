import { baseURL, pluginURL } from '../constants/url';
import httpClient from './httpClient';
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
  return httpClient.get('https://api.github.com/repos/onaug6th/i-helper/releases/latest');
}

/**
 * 获取更新包
 * @param url
 * @returnsw
 */
function getInstallPackage(url: string): any {
  progress(request(url), {
    throttle: 1000
  })
    .on('progress', state => {
      console.info(Number(Math.round(state.percent * 100)));
    })
    .on('error', err => {
      console.info(err);
    });
  // .on('end', () => {
  //   this.$electron.ipcRenderer.send('quit-and-open', path.join(saveDir, filename));
  // })
  // .pipe(fs.createWriteStream(path.join(saveDir, filename)));
}

export { getPluginList, downloadPlugin, getPlugin, getLatestVersionInfo, getInstallPackage };
