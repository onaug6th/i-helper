//  插件数据库
import pluginDB from '@/main/dataBase/plugin.db';
import compressing from 'compressing';
import path from 'path';
import * as utils from '@/render/utils';
import * as fsUtils from '@/render/utils/fs';
import * as pluginUtils from '@/main/utils/plugin';
//  插件属性名称常量
import { pluginConfigKey } from '@/main/constants/plugin';
import storeService from '../store/store.service';

/**
 * publishZips 发布时，插件的压缩包文件夹
 * pluginPackages 安装后插件的文件夹
 * pluginZips 安装的插件压缩包文件夹
 */

class PluginService {
  pluginList: Array<any> = [];

  async appOnReady(app) {
    await this.getPluginList();

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
  async getPluginList() {
    const pluginList = await pluginDB.find();
    this.pluginList = pluginList;
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
   * 1. 数据库中移除
   * 2. 内存中移除
   * 3. 删除插件目录
   * 4. 从商店中更新此插件的已下载标记
   * @param id
   */
  delPlugin(id: string) {
    pluginDB.remove({ id });
    const plugin = this.getPlugin(id);
    const index = this.pluginList.findIndex(plugin => plugin.id === id);
    this.pluginList.splice(index, 1);

    const folderPath = plugin[pluginConfigKey.FOLDER_PATH];
    fsUtils.delDir(folderPath);

    storeService.clearIsDownload(id);
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
    const size = await fsUtils.getFileSize(zipPath);
    //  解压缩
    const jsonPath = await this.uncompressZip(zipPath);

    const { error, file } = await pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      throw new Error(error);
    }

    const saveData = {
      ...file,
      sizeFormat: utils.byteConvert(size)
    };

    const result = await pluginDB.insert(saveData);

    this.pluginList.push(result);

    storeService.clearIsDownload(file.id);

    return result;
  }
}

export default new PluginService();
