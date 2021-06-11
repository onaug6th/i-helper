import * as pluginAPI from '@/main/api/plugin';

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
  download(id: string) {
    id;
    debugger;
  }
}

export default new Store();
