import * as pluginAPI from '@/main/api/plugin';
import path from 'path';
import fs from 'fs';
import pluginService from '../plugin/plugin.service';
import * as fsUtils from '@/render/utils/fs';

class Store {
  pluginList: Array<any> = [];

  async appOnReady() {
    this.pluginList = await pluginAPI.getPluginList();
  }

  /**
   * 获取插件列表
   * @returns
   */
  getPluginList() {
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
   * 插件下载
   * @param id
   */
  async download(id: string) {
    const plugin = this.getPlugin(id);
    const pluginZipsPath = `${global.rootPath}\\pluginZips`;
    fsUtils.safeCreatedir(pluginZipsPath);
    const zipPath = path.resolve(pluginZipsPath, `${plugin.name}.zip`);
    const writer = fs.createWriteStream(zipPath);

    const data = await pluginAPI.downloadPlugin('https://' + plugin.fileUrl);
    data.pipe(writer);
    writer.on('finish', () => {
      pluginService.installPlugin(zipPath);
    });
  }
}

export default new Store();
