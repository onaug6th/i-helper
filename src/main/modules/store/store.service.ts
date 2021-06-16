import * as pluginAPI from '@/main/api/plugin';
import path from 'path';
import fs from 'fs';
import pluginService from '../plugin/plugin.service';
import * as fsUtils from '@/render/utils/fs';
import { pluginConfigKey } from '@/main/constants/plugin';

class Store {
  pluginList: Array<any> = [];

  async appOnReady() {
    await this.getPluginList();
  }

  /**
   * 获取插件列表
   * @returns
   */
  async getPluginList() {
    const data = await pluginAPI.getPluginList();
    data.forEach(plugin => {
      //  如存在已下载的插件中，需要标记为已下载
      if (pluginService.getPlugin(plugin[pluginConfigKey.ID])) {
        plugin.isDownload = true;
      }
    });
    this.pluginList = data;
    return this.pluginList;
  }

  /**
   * 获取插件信息
   * @param id
   * @returns
   */
  getPlugin(id: string) {
    return this.pluginList.find(app => app.id === id);
  }

  /**
   * 清除插件下载标记
   * @param id
   */
  clearIsDownload(id: string) {
    this.pluginList.find(plugin => {
      if (plugin.id === id) {
        plugin.isDownload = false;
      }
    });
  }

  /**
   * 插件下载
   * 1. 创建文件夹
   * 2. 下载压缩包
   * 3. 下载成功后，安装此压缩包
   * 4. 安装成功后，更新此插件的下载标记
   * @param id
   */
  async download(id: string) {
    const plugin = this.getPlugin(id);
    const pluginZipsPath = `${global.rootPath}\\pluginZips`;
    //  安全的创建文件夹
    fsUtils.safeCreatedir(pluginZipsPath);

    const zipPath = path.resolve(pluginZipsPath, `${plugin.name}.zip`);
    const writer = fs.createWriteStream(zipPath);

    const data = await pluginAPI.downloadPlugin('https://' + plugin.fileUrl);

    const finish = new Promise(resolve => {
      writer.on('finish', async () => {
        await pluginService.installPlugin(zipPath);
        plugin.isDownload = true;
        resolve(true);
      });
    });

    data.pipe(writer);
    await finish;
  }
}

export default new Store();
