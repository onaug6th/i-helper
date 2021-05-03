import fs from 'fs';
//  便笺数据库
import devPluginDB from '@/main/dataBase/devPlugin.db';
import { uuid } from '@/render/utils';
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
   * 根据文件获取插件信息
   * @param filePath
   * @returns
   */
  getPluginInfoByFile(filePath) {
    const text = fs.readFileSync(filePath, 'utf8');
    const file = JSON.parse(text);

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

    //  增加json文件的路径
    file.pluginJSONPath = filePath;
    return file;
  }

  /**
   * 新增开发者插件
   * @param path
   * @returns
   */
  async addPlugin(path) {
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
   * 更新开发者插件
   * @param id
   */
  async updatePlugin(id) {
    const plugin = this.getPlugin(id);
    const file = this.getPluginInfoByFile(plugin.pluginJSONPath);
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
