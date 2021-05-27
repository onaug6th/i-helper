import fs from 'fs';
//  便笺数据库
import devPluginDB from '@/main/dataBase/devPlugin.db';
import { uuid } from '@/render/utils';
import compressing from 'compressing';
import { exec } from 'child_process';
//  插件属性名称常量
import { pluginConfigKey } from '@/main/config/browserWindow';

/**
 * 补全对象的属性路径
 * @param obj
 * @param folderPath 文件目录路径
 */
function pathCompletion(obj: any, folderPath: string) {
  const main = obj[pluginConfigKey.MAIN];
  const preload = obj[pluginConfigKey.PRELOAD];

  //  入口文件，如不为 http 协议开头，补全文件夹目录加入口文件地址
  if (!main.startsWith('http')) {
    obj[pluginConfigKey.MAIN] = `${folderPath}${main}`;
  }

  //  预加载js文件
  if (preload) {
    obj[pluginConfigKey.PRELOAD] = `${folderPath}${preload}`;
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
   * @param jsonPath
   * @returns
   */
  getJSONFileData(jsonPath: string) {
    const text = fs.readFileSync(jsonPath, 'utf8');
    return JSON.parse(text);
  }

  /**
   * 校验json文件是否合法
   */
  validPluginJSON(jsonPath: string) {
    const file = this.getJSONFileData(jsonPath);
    const main = file[pluginConfigKey.MAIN];
    const name = file[pluginConfigKey.NAME];
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
   * @param jsonPath
   * @returns
   */
  getPluginInfoByFile(jsonPath: string) {
    const file = this.getJSONFileData(jsonPath);

    //  文件夹路径
    const folderPath = jsonPath.replace('plugin.json', '');
    //  图标
    const logo = file[pluginConfigKey.LOGO];
    //  补全插件图标路径
    file[pluginConfigKey.LOGO] = `atom:///${folderPath}${logo}`;

    //  补全路径
    pathCompletion(file, folderPath);
    //  存在开发者配置
    if (file[pluginConfigKey.DEV]) {
      //  补全dev的路径
      pathCompletion(file[pluginConfigKey.DEV], folderPath);
    }

    //  json文件的路径
    file[pluginConfigKey.JSON_PATH] = jsonPath;
    //  文件夹路径（移除了最后的斜杠）
    file[pluginConfigKey.FOLDER_PATH] = folderPath.slice(0, -1);
    file[pluginConfigKey.FOLDER_NAME] = file[pluginConfigKey.FOLDER_PATH].split('\\').pop();

    return file;
  }

  /**
   * 新增开发者插件
   * @param jsonPath
   * @returns
   */
  async addPlugin(jsonPath: string) {
    const validFile = this.validPluginJSON(jsonPath);

    //  校验文件的合法
    if (validFile) {
      return Promise.reject(validFile);
    }

    const file = this.getPluginInfoByFile(jsonPath);

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
    return new Promise(resolve => {
      const plugin = this.getPlugin(id);
      //  插件名称
      const name = plugin[pluginConfigKey.NAME];
      //  插件所在文件夹路径
      const folderPath = plugin[pluginConfigKey.FOLDER_PATH];
      //  插件配置文件所属文件夹名称
      const folderName = plugin[pluginConfigKey.FOLDER_NAME];
      //  打包后的压缩包名称
      const zipPath = `${folderPath.replace(folderName, name)}.zip`;

      compressing.zip
        .compressDir(folderPath, zipPath)
        .then(() => {
          const afterFilePath = `${folderPath}\\${name}.zip`;

          fs.rename(zipPath, afterFilePath, function(err) {
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
   * 更新开发者插件
   * @param id
   */
  async updatePlugin(id: string) {
    const plugin = this.getPlugin(id);
    const file = this.getPluginInfoByFile(plugin[pluginConfigKey.JSON_PATH]);
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
