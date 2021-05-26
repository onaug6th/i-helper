import fs from 'fs';
//  便笺数据库
import devPluginDB from '@/main/dataBase/devPlugin.db';
import { uuid } from '@/render/utils';
import compressing from 'compressing';
import * as utils from '@/render/utils';
import { exec } from 'child_process';

/**
 * 补全路径
 * @param obj
 * @param folderPath 文件目录路径
 */
function pathCompletion(obj, folderPath) {
  //  入口文件，如不为 http 协议开头，补全文件夹目录加入口文件地址
  if (!obj.main.startsWith('http')) {
    obj.main = `${folderPath}${obj.main}`;
  }

  //  预加载js文件
  if (obj.preload) {
    obj.preload = `${folderPath}${obj.preload}`;
  }
}

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
   * 根据json文件路径获取json数据
   * @param filePath
   * @returns
   */
  getJSONFileData(filePath: string) {
    const text = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(text);
  }

  /**
   * 校验json文件是否合法
   */
  validFile(path) {
    const file = this.getJSONFileData(path);
    const main = file.main;
    const name = file.name;
    let result: string;

    if (main) {
      if (!/\.html$/i.test(main)) {
        result = '入口文件不是HTML文件（main）';
      }
    } else {
      result = '没有指定入口文件（main）';
    }

    if (!name) {
      result = '没有指定插件名称（name）';
    }
    return result;
  }
  /**
   * 根据文件路径获取插件信息
   * @param filePath
   * @returns
   */
  getPluginInfoByFile(filePath: string) {
    const file = this.getJSONFileData(filePath);

    //  文件夹路径
    const folderPath = filePath.replace('plugin.json', '');
    //  插件图标
    file.logo = `atom:///${folderPath}${file.logo}`;

    //  补全路径
    pathCompletion(file, folderPath);

    if (file.dev) {
      //  补全dev的路径
      pathCompletion(file.dev, folderPath);
    }

    //  json文件的路径
    file.jsonPath = filePath;
    //  文件夹路径（移除了最后的斜杠）
    file.folderPath = folderPath.slice(0, -1);
    return file;
  }

  /**
   * 新增开发者插件
   * @param path
   * @returns
   */
  async addPlugin(path: string) {
    const validFile = this.validFile(path);
    //  校验文件的合法
    if (validFile) {
      return Promise.reject(validFile);
    }

    const file = this.getPluginInfoByFile(path);

    const result = await devPluginDB.insert({
      id: uuid(),
      ...file
    });

    this.pluginList.push(result);

    return result;
  }

  /**
   * 删除开发者插件
   * @param id
   */
  delPlugin(id) {
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
  getPlugin(id) {
    return this.pluginList.find(plugin => plugin.id === id);
  }

  /**
   * 打包开发者插件
   * @param id
   */
  async buildPlugin(id) {
    return new Promise(resolve => {
      const plugin = this.getPlugin(id);

      const folderPath = plugin.folderPath;
      const zipPath = `${folderPath}.zip`;

      compressing.zip
        .compressDir(folderPath, zipPath)
        .then(() => {
          const afterFilePath = `${folderPath}\\${utils.getLastPath(folderPath)}.zip`;

          fs.rename(`${folderPath}.zip`, afterFilePath, function(err) {
            if (err) {
              console.info(err);
              resolve(false);
            }
            exec(`explorer.exe /select,${afterFilePath}`);
            resolve(true);
          });
        })
        .catch(() => {
          resolve(false);
        });
    });
  }

  /**
   * @desc 解压缩插件压缩包
   */
  uncompressPlugin() {
    // 解压缩
    // compressing.zip
    //   .uncompress('nodejs-compressing-demo.zip', 'nodejs-compressing-demo3')
    //   .then(() => {
    //     console.log('success');
    //   })
    //   .catch(err => {
    //     console.error(err);
    //   });
  }

  /**
   * 更新开发者插件
   * @param id
   */
  async updatePlugin(id) {
    const plugin = this.getPlugin(id);
    const file = this.getPluginInfoByFile(plugin.jsonPath);
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
