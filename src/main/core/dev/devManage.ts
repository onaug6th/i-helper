const appList = [
  {
    id: 'a2s14d1s3q5f1e121fs',
    name: '测试插件',
    path: 'C:\\Users\\onaug6th\\Desktop\\新建文件夹\\index.html',
    avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
    desc: '测试'
  }
];

class DevManage {
  appList: Array<any> = [];

  appOnReady() {
    this.appList = appList;
  }

  getAppList() {
    return this.appList;
  }

  getDevApp(id) {
    return this.appList.find(app => app.id === id);
  }
}

export default new DevManage();
