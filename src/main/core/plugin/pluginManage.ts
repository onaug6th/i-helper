//  插件数据库
import pluginDB from '@/main/dataBase/plugin.db';
import compressing from 'compressing';
import path from 'path';
import * as utils from '@/render/utils';
import * as pluginUtils from '@/main/utils/plugin';

// const pluginList = [
//   {
//     id: 'a2s14d1s3q5f1e121fs',
//     name: '测试插件',
//     avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
//     desc: '测试'
//   },
//   {
//     id: 'x5a6a1ca6sd5asd1a6s',
//     name: '便笺',
//     avatar: 'https://onaug6th-1253668581.cos.ap-guangzhou.myqcloud.com/common/92249761857029110.jpg',
//     desc: '桌面纸条便笺'
//   },
//   {
//     id: 'ca6sd5asx5a6a1d1a6s',
//     name: '剪贴板',
//     avatar: '//sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/juejin-extension-icon.4b79fb4.png',
//     desc: '记录每一个重要的数据'
//   },
//   {
//     id: 'zxc1asde5awd1asd0',
//     name: '提醒',
//     avatar: 'https://github.githubassets.com/images/icons/emoji/octocat.png',
//     desc: '设置提醒'
//   },
//   {
//     id: 'x5aasdas6as1dasd5',
//     name: '待办事项',
//     avatar: '//sf3-scmcdn2-tos.pstatp.com/xitu_juejin_web/img/juejin-miner.b78347c.png',
//     desc: '即将完成的内容和已完成的内容'
//   }
// ];

class PluginManage {
  pluginList: Array<any> = [];

  appOnReady(app) {
    pluginDB.find().then(pluginList => {
      this.pluginList = pluginList;
    });

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
   * 删除插件
   * @param id
   */
  delPlugin(id: string) {
    pluginDB.remove({
      id
    });
    const index = this.pluginList.findIndex(plugin => plugin.id === id);
    this.pluginList.splice(index, 1);
  }

  /**
   * 解压缩插件压缩包
   * @param zipPath
   */
  async uncompressZip(zipPath: string): Promise<string> {
    //  文件夹名称
    const folderName = utils.getLastPath(zipPath).replace('.zip', '');
    //  解压缩后的文件夹路径
    const afterFilePath = path.join(global.rootPath, `pluginPackages\\${folderName}`);
    //  解压缩后的文件夹内的插件配置路径
    const jsonPath = `${afterFilePath}\\${folderName}\\plugin.json`;

    try {
      // 解压缩
      await compressing.zip.uncompress(zipPath, afterFilePath);
    } catch (error) {
      throw new Error(error);
    }

    return jsonPath;
  }

  /**
   * 安装插件
   * @param zipPath
   */
  async installPlugin(zipPath: string) {
    //  解压缩
    const jsonPath = await this.uncompressZip(zipPath);

    const { error, file } = pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      throw new Error(error);
    }

    const result = await pluginDB.insert({
      id: utils.uuid(),
      ...file
    });

    this.pluginList.push(result);

    return result;
  }
}

export default new PluginManage();
