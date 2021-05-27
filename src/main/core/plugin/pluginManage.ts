import compressing from 'compressing';
import path from 'path';
import * as utils from '@/render/utils';

const appList = [
  {
    id: 'a2s14d1s3q5f1e121fs',
    name: '测试插件',
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

class PluginManage {
  appList: Array<any> = [];

  appOnReady(app) {
    this.appList = appList;

    app.on('web-contents-created', (event, contents) => {
      contents.on('will-attach-webview', (event, webPreferences, params) => {
        //  启用NodeJS集成。
        webPreferences.nodeIntegration = true;
        params;
        contents;
        debugger;
      });
    });
  }

  getPluginList() {
    return this.appList;
  }

  getPlugin(id: string) {
    return this.appList.find(app => app.id === id);
  }

  /**
   * 解压缩插件压缩包
   * @param zipPath
   */
  async uncompressZip(zipPath: string) {
    const folderName = utils.getLastPath(zipPath).replace('.zip', '');
    const afterFilePath = path.join(global.rootPath, `pluginPackages\\${folderName}`);

    return new Promise(resolve => {
      // 解压缩
      compressing.zip
        .uncompress(zipPath, afterFilePath)
        .then(() => {
          const jsonPath = `${afterFilePath}\\${folderName}\\plugin.json`;
          debugger;
          jsonPath;
          resolve(true);
        })
        .catch(err => {
          resolve(err);
        });
    });
  }

  /**
   * 安装插件
   * @param zipPath
   */
  async installPlugin(zipPath: string) {
    // 解压缩
    const result = await this.uncompressZip(zipPath);

    if (result !== true) {
      return Promise.reject(result);
    }
  }
}

export default new PluginManage();
