import fs from 'fs';

const appList = [
  {
    id: 'a2s14d1s3q5f1e121fs',
    name: '测试插件',
    path: 'C:\\Users\\onaug6th\\Desktop\\新建文件夹\\index.html',
    logo: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
    desc: '测试'
  }
];

class DevManage {
  appList: Array<any> = [];

  /**
   * 在应用启动后执行的回调
   */
  appOnReady() {
    this.appList = appList;
  }

  /**
   * 获取开发者插件列表
   * @returns
   */
  getDevPluginList() {
    return this.appList;
  }

  /**
   * 新增开发者插件
   * @param plugin
   * @returns
   */
  addDevPlugin(plugin) {
    const { path, name } = plugin;
    const file = JSON.parse(fs.readFileSync(path, 'utf8'));

    const folderPath = path.replace(name, '');
    file.logo = `atom:///${folderPath}${file.logo}`;
    file.main = `${folderPath}${file.main}`;
    debugger;
    return file;
  }

  /**
   * 获取开发者插件
   * @param id
   * @returns
   */
  getDevApp(id) {
    return this.appList.find(app => app.id === id);
  }
}

export default new DevManage();
