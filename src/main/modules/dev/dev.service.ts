//  开发者插件数据库
import devPluginDB from '@/main/dataBase/devPlugin.db';
//  插件属性名称常量
import { pluginConfigKey } from '@/main/constants/plugin';
import * as utils from '@/render/utils';
import * as fsUtils from '@/render/utils/fs';
import * as pluginUtils from '@/main/utils/plugin';
import { publishURL } from '@/main/constants/url';
import FormData from 'form-data';
import fs from 'fs';
class DevService {
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
   * 新增开发者插件
   * @param jsonPath
   * @returns
   */
  async addPlugin(jsonPath: string) {
    const { error, file } = await pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      throw new Error(error);
    }

    const result = await devPluginDB.insert({
      id: utils.uuid(),
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
    const plugin = this.getPlugin(id);

    //  需要打包的文件夹
    const folderPath = plugin[pluginConfigKey.FOLDER_PATH];

    await fsUtils.buildDirTo(folderPath, `${global.downloadPath}\\${plugin.name}`);
  }

  /**
   * 更新开发者插件
   * @param id
   */
  async updatePluginByJson(id: string) {
    const plugin = this.getPlugin(id);
    const jsonPath = plugin[pluginConfigKey.JSON_PATH];

    const { error, file } = await pluginUtils.getPluginInfoByFile(jsonPath);

    if (error) {
      throw new Error(error);
    }

    const updateContent = {
      id,
      ...file
    };

    this.updatePluginInDbOrMemory(id, updateContent);

    return updateContent;
  }

  /**
   * 更新插件在数据库/内存中的数据
   * @param id
   * @param data
   */
  async updatePluginInDbOrMemory(id, data) {
    await devPluginDB.update(
      {
        id
      },
      data
    );

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
              data = JSON.parse(Buffer.concat(bufferArr).toString());
            } catch (e) {
              reject('上传失败');
            }

            if (!data) {
              reject('上传失败');
            }
            if (data.success) {
              resolve(true);
            } else {
              reject(data.msg);
            }
          });
      });
    });
  }

  /**
   * 插件发布
   * @param id
   * @param desc
   */
  async publish(id: string, desc: string) {
    const plugin = this.getPlugin(id);
    //  需要打包的文件夹
    const folderPath = plugin[pluginConfigKey.FOLDER_PATH];
    //  打包后的路径
    const rootFolderPath = `${global.rootPath}\\pluginZips\\${plugin.name}`;
    const zipPath = await fsUtils.buildDirTo(folderPath, rootFolderPath, false);

    const file = fs.createReadStream(zipPath);
    const logo = fs.createReadStream(plugin[pluginConfigKey.LOGO_PATH]);
    const body = {
      id,
      name: plugin.name,
      version: plugin.version,
      desc,
      readme: plugin[pluginConfigKey.README_CONTENT]
    };

    const formData = new FormData();
    formData.append('file', file);
    formData.append('logo', logo);
    for (const i in body) {
      formData.append(i, body[i]);
    }

    try {
      await this.formDataSubmit(formData);
    } catch (error) {
      throw new Error(error);
    }

    const updateContent = {
      ...plugin,
      publishVerson: plugin.version
    };

    this.updatePluginInDbOrMemory(id, updateContent);

    return updateContent;
  }
}

export default new DevService();
