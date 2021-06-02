//  开发者插件数据库
import devPluginDB from '@/main/dataBase/devPlugin.db';
import { exec } from 'child_process';
//  插件属性名称常量
import { pluginConfigKey } from '@/main/config/browserWindow';
import compressing from 'compressing';
import * as utils from '@/render/utils';
import * as fsUtils from '@/render/utils/fs';
import * as pluginUtils from '@/main/utils/plugin';

class DevManage {
  pluginList: Array<any> = [];

  /**
   * 在应用启动后执行的回调
   */
  appOnReady() {
    devPluginDB.find().then(pluginList => {
      this.pluginList = pluginList;
    });
  }

  /**
   * 获取开发者插件列表
   * @returns
   */
  getPluginList() {
    return this.pluginList;
  }

  /**
   * 新增开发者插件
   * @param jsonPath
   * @returns
   */
  async addPlugin(jsonPath: string) {
    const { error, file } = pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      throw new Error(error);
    }

    const result = await devPluginDB.insert({
      id: utils.uuid(),
      ...file
    });

    this.pluginList.push(result);

    return result;
  }

  /**
   * 删除开发者插件
   * @param id
   */
  delPlugin(id: string) {
    devPluginDB.remove({
      id
    });
    const index = this.pluginList.findIndex(plugin => plugin.id === id);
    this.pluginList.splice(index, 1);
  }

  /**
   * 获取开发者插件
   * @param id
   * @returns
   */
  getPlugin(id: string) {
    return this.pluginList.find(plugin => plugin.id === id);
  }

  /**
   * 打包开发者插件
   * @param id
   */
  async buildPlugin(id: string) {
    const plugin = this.getPlugin(id);
    //  插件名称
    const name = plugin[pluginConfigKey.NAME];
    //  插件所在文件夹路径
    const folderPath = plugin[pluginConfigKey.FOLDER_PATH];

    //  根目录压缩包文件夹
    const rootFolderPath = `${global.rootPath}\\pluginZips\\${name}`;

    try {
      //  将插件文件拷到根目录压缩包文件夹
      await fsUtils.copy(folderPath, rootFolderPath);

      //  打包后的压缩包名称
      const zipPath = `${rootFolderPath}.zip`;
      await compressing.zip.compressDir(rootFolderPath, zipPath);

      exec(`explorer.exe /select,${zipPath}`);
      fsUtils.delDir(rootFolderPath);
    } catch (error) {
      throw new Error('打包失败');
    }
  }

  /**
   * 更新开发者插件
   * @param id
   */
  async updatePlugin(id: string) {
    const plugin = this.getPlugin(id);
    const jsonPath = plugin[pluginConfigKey.JSON_PATH];

    const { error, file } = pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      return Promise.reject(error);
    }

    for (let i = 0; i < this.pluginList.length; i++) {
      if (this.pluginList[i].id === id) {
        this.pluginList[i] = file;
        break;
      }
    }

    const updateContent = {
      id,
      ...file
    };

    await devPluginDB.update(
      {
        id
      },
      updateContent
    );

    return updateContent;
  }
}

export default new DevManage();
