import fs from 'fs';
//  便笺数据库
import devPluginDB from '@/main/dataBase/devPlugin.db';
import { uuid } from '@/render/utils';

class DevManage {
  pluginList: Array<any> = [];

  /**
   * 在应用启动后执行的回调
   */
  appOnReady() {
    devPluginDB._db.find({}).exec((e, d) => {
      this.pluginList = d;
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
   * @param plugin
   * @returns
   */
  async addPlugin(plugin) {
    const { path, name } = plugin;
    const text = fs.readFileSync(path, 'utf8');
    const file = JSON.parse(text);

    const folderPath = path.replace(name, '');
    file.logo = `atom:///${folderPath}${file.logo}`;

    //  入口文件
    //  如不为 http 协议开头，补全文件夹目录加入口文件地址
    if (!file.main.startsWith('http')) {
      file.main = `${folderPath}${file.main}`;
    }

    //  预加载js文件
    if (file.preload) {
      file.preload = `file://${folderPath}/preload.js`;
    }

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
}

export default new DevManage();
