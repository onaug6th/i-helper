const appList = [
  {
    id: 'a2s14d1s3q5f1e121fs',
    name: 'test',
    path: 'http://localhost:8080',
    avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
    desc: '测试'
  },
  {
    id: 'x5a6a1ca6sd5asd1a6s',
    name: '便笺',
    avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
    desc: '桌面纸条便笺'
  },
  {
    id: 'ca6sd5asx5a6a1d1a6s',
    name: '剪贴板',
    avatar: '//sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/juejin-extension-icon.4b79fb4.png',
    desc: '记录每一个重要的数据'
  },
  {
    id: 'zxc1asde5awd1asd0',
    name: '提醒',
    avatar: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
    desc: '设置提醒'
  },
  {
    id: 'x5aasdas6as1dasd5',
    name: '待办事项',
    avatar: '//sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/juejin-miner.b78347c.png',
    desc: '即将完成的内容和已完成的内容'
  }
];

class MiniAppManage {
  appList: Array<any> = [];

  appOnReady() {
    this.appList = appList;
  }

  getAppList() {
    return this.appList;
  }
}

export default new MiniAppManage();
