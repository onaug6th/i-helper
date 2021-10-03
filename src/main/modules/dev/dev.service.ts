//  开发者插件数据库
import devPluginDB from '@/main/dataBase/devPlugin.db';
import * as utils from '@/main/utils';
import * as fsUtils from '@/main/utils/fs';
import * as pluginUtils from '@/main/utils/plugin';
import { docsPluginURL, publishURL } from '@/main/constants/url';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path';
import { dialog, shell } from 'electron';
import pluginService from '../plugin/plugin.service';
import windowService from '../window/window.service';
import userService from '../user/user.service';

import * as api from '@/main/api/review';

enum ReviewStatus {
  pending,
  success,
  fail
}

class DevService {
  pluginList: Array<Plugin> = [];

  /**
   * 在应用启动后执行的回调
   */
  async appOnReady() {
    const pluginList: Array<Plugin> = await devPluginDB.find();
    this.pluginList = pluginList;
  }

  /**
   * 初始化开发者插件的审核状态
   */
  async initReviewStatus() {
    const pluginList = this.pluginList;

    for (let i = 0; i < this.pluginList.length; i++) {
      const plugin = pluginList[i];

      //  存在审核状态，查询最新的审核状态
      if (plugin.reviewStatus === ReviewStatus.pending) {
        const review = await api.lastestReview(plugin.id);

        if (review) {
          //  更新内存中插件信息
          plugin.reviewStatus = review.status;
          plugin.reviewContent = review.content;

          //  更新数据库中的插件信息
          this.updatePluginInDb(plugin.id, {
            ...plugin,
            reviewStatus: review.status,
            reviewContent: review.content
          });
        } else {
          //  更新内存中插件信息
          plugin.reviewStatus = ReviewStatus.success;
          plugin.reviewContent = '';
        }
      }
    }
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
   * @param jsonPath
   * @returns
   */
  async addPlugin(jsonPath: string): Promise<Plugin> {
    const { error, file } = await pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      throw new Error(error);
    }

    const fileId = file.id;
    const id = fileId || utils.uuid();

    if (this.getPlugin(id)) {
      throw new Error('此开发者插件已经添加过了');
    }

    const result = await devPluginDB.insert({
      id,
      ...file
    });

    if (!fileId) {
      fsUtils.updateJson(jsonPath, {
        id
      });
    }

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
  getPlugin(id: string): Plugin {
    return this.pluginList.find(plugin => plugin.id === id);
  }

  /**
   * 打包开发者插件
   * @param id
   */
  async buildPlugin(id: string) {
    const plugin = this.getPlugin(id);

    //  需要打包的文件夹
    const folderPath = plugin.folderPath;
    //  打包后的路径
    const afterFolderPath = path.join(global.downloadPath, plugin.id);
    const user = userService.getUser();

    const buildConfig: any = {
      from: folderPath,
      to: afterFolderPath
    };

    if (user) {
      buildConfig.updateJsonData = {
        authorId: user.userId,
        authorName: user.name
      };
    }
    await fsUtils.buildDirTo(buildConfig);
  }

  /**
   * 重新加载开发者插件
   * @param id
   */
  async reload(id: string) {
    const plugin = this.getPlugin(id);
    const jsonPath = plugin.jsonPath;

    return this.reloadPluginByJsonFile(id, jsonPath);
  }

  /**
   * 根据json文件路径重载插件信息
   * @param id 插件ID
   * @param jsonPath json文件路径
   * @returns
   */
  async reloadPluginByJsonFile(id: string, jsonPath: string) {
    const { error, file } = await pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      throw new Error(error);
    }

    const updateContent = {
      id,
      ...file
    };
    //  不需要等待，再争取点优化空间（没有时间浪费了！）
    this.updatePluginInDbOrMemory(id, updateContent);

    return updateContent;
  }

  /**
   * 更新数据库中的插件信息
   * @param id
   * @param data
   * @returns
   */
  updatePluginInDb(id: string, data: Plugin) {
    return devPluginDB.update(
      {
        id
      },
      data
    );
  }

  /**
   * 更新插件在数据库/内存中的数据
   * @param id
   * @param data
   */
  async updatePluginInDbOrMemory(id: string, data: Plugin) {
    await this.updatePluginInDb(id, data);

    for (let i = 0; i < this.pluginList.length; i++) {
      if (this.pluginList[i].id === id) {
        this.pluginList[i] = data;
        break;
      }
    }
  }

  /**
   * 表单数据提交
   * @param formData
   * @returns
   */
  formDataSubmit(formData) {
    return new Promise((resolve, reject) => {
      formData.submit(publishURL, (err, res) => {
        if (err) {
          reject('上传失败');
        }

        const bufferArr = [];
        res
          .on('data', e => {
            bufferArr.push(e);
          })
          .on('end', () => {
            let data = null;
            try {
              const resStr = Buffer.concat(bufferArr).toString();
              data = JSON.parse(resStr);
            } catch (e) {
              return reject('上传失败');
            }

            if (!data) {
              return reject('上传失败');
            }

            if (data.success) {
              return resolve(true);
            } else {
              return reject(data.msg);
            }
          });
      });
    });
  }

  /**
   * 插件发布
   * @param id
   * @param auditDesc
   */
  async publish(id: string, auditDesc: string) {
    const plugin = this.getPlugin(id);

    //  需要打包的文件夹路径
    const folderPath = plugin.folderPath;
    //  打包后的路径
    const afterFolderPath = path.join(global.rootPath, 'publishZips', id);

    const user = userService.getUser();

    //  打完包后的压缩包路径
    const zipPath = await fsUtils.buildDirTo({
      from: folderPath,
      to: afterFolderPath,
      explorer: false,
      updateJsonData: {
        //  此处可以更新发布的插件json文件内容
        authorId: user.userId,
        authorName: user.name
      }
    });

    const zip = fs.createReadStream(zipPath);
    const logo = fs.createReadStream(plugin.logoPath);
    const body = {
      id,
      name: plugin.name,
      version: plugin.version,
      desc: plugin.desc,
      auditDesc,
      readmeContent: plugin.readmeContent,
      authorId: user.userId
    };

    const formData = new FormData();
    formData.append('zip', zip);
    formData.append('logo', logo);
    for (const i in body) {
      formData.append(i, body[i]);
    }

    try {
      await this.formDataSubmit(formData);
    } catch (error) {
      throw new Error(error);
    }

    //  正在审核
    plugin.reviewStatus = ReviewStatus.pending;
    //  更新插件在数据库/内存中的数据
    await this.updatePluginInDbOrMemory(id, plugin);

    //  因为发布了插件，需要刷新插件的安装信息
    await pluginService.initPluginInstallInfo();

    return plugin;
  }

  /**
   * 在文件夹中查看
   * @param id
   */
  showInFolder(id: string) {
    const plugin = this.getPlugin(id);
    fsUtils.showInFolder(plugin.jsonPath);
  }

  /**
   * 更新插件的json读取文件路径
   * @param id 插件ID
   */
  async updateJsonPath(id: string) {
    const plugin = this.getPlugin(id);
    const files = dialog.showOpenDialogSync({
      defaultPath: plugin.jsonPath,
      properties: ['openFile'],
      filters: [
        {
          name: 'json配置文件',
          extensions: ['json']
        }
      ]
    });

    if (files) {
      const jsonPath = files[0];
      return await this.reloadPluginByJsonFile(id, jsonPath);
    }
  }

  /**
   * 切换打开开发者工具
   * @param winId
   */
  toggleDevTools(winId: number) {
    const viewId = windowService.pluginWinItems[winId].viewId;
    const viewItem = windowService.viewWins[viewId].viewItem;

    viewItem.webContents.toggleDevTools();
  }

  /**
   * 查看版本信息
   */
  openDocs() {
    shell.openExternal(docsPluginURL);
  }
}

export default new DevService();
