//  插件数据库
import pluginDB from '@/main/dataBase/plugin.db';
import compressing from 'compressing';
import path from 'path';
import * as utils from '@/render/utils';
import * as fsUtils from '@/render/utils/fs';
import * as pluginUtils from '@/main/utils/plugin';
//  插件属性名称常量
import { pluginConfigKey } from '@/main/constants/plugin';
import * as pluginAPI from '@/main/api/plugin';
class PluginService {
  pluginList: Array<any> = [];

  async appOnReady(app) {
    this.pluginList = await pluginAPI.getPluginList();

    app.on('web-contents-created', (event, contents) => {
      contents.on('will-attach-webview', (event, webPreferences, params) => {
        params;
        webPreferences;
        contents;
        debugger;
      });
    });
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
   * 删除插件
   * @param id
   */
  delPlugin(id: string) {
    pluginDB.remove({ id });
    const plugin = this.getPlugin(id);
    const index = this.pluginList.findIndex(plugin => plugin.id === id);
    this.pluginList.splice(index, 1);

    const folderPath = plugin[pluginConfigKey.FOLDER_PATH];
    fsUtils.delDir(folderPath);
  }

  /**
   * 解压缩插件压缩包
   * @param zipPath
   */
  async uncompressZip(zipPath: string): Promise<string> {
    //  文件夹名称
    const folderName = utils.getLastPath(zipPath).replace('.zip', '');
    //  解压缩后的文件夹路径
    const afterFilePath = path.join(global.rootPath, `pluginPackages\\${folderName}`);
    //  解压缩后的文件夹内的插件配置路径
    const jsonPath = `${afterFilePath}\\${folderName}\\plugin.json`;

    try {
      // 解压缩
      await compressing.zip.uncompress(zipPath, afterFilePath);
    } catch (error) {
      throw new Error(error);
    }

    return jsonPath;
  }

  /**
   * 安装插件
   * @param zipPath
   */
  async installPlugin(zipPath: string) {
    //  解压缩
    const jsonPath = await this.uncompressZip(zipPath);

    const { error, file } = await pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      throw new Error(error);
    }

    const result = await pluginDB.insert({
      id: utils.uuid(),
      ...file
    });

    this.pluginList.push(result);

    return result;
  }

  /**
   * 插件下载
   * @param id
   */
  download(id: string) {
    id;
    debugger;
  }
}

export default new PluginService();
