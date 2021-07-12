import { getInstallPackage, getLatestVersionInfo } from '@/main/api';
import { browserWindowOptions } from '@/main/constants/config/browserWindow';
import { byteConvert, compareVersion } from '@/utils';
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, dialog, shell } from 'electron';
import windowService from '../window/window.service';

interface GithubLatestVersion {
  [propName: string]: any;
}

class UpdateService {
  /**
   * 内存数据
   */
  version: string = app.getVersion();

  //  更新面板实例
  updateWinow: BrowserWindow;
  //  更新信息
  updateInfo: any = {};

  /**
   * 应用初始化时执行
   */
  appOnReady() {
    this.version;
  }

  /**
   * 打开更新弹窗
   */
  updateWinOpen() {
    if (this.updateWinow && !this.updateWinow.isDestroyed()) {
      this.updateWinow.show();
      return;
    }
    const url = windowService.getWebUrl('update');

    const option = browserWindowOptions.update;

    this.updateWinow = windowService.createBrowserWindow({ option, url });
  }

  /**
   * 关闭更新弹窗
   */
  updateWinClose() {
    if (!this.updateWinow.isDestroyed()) {
      this.updateWinow.destroy();
    }
    this.updateWinow = null;
  }

  sendWebContents({ transferred, total, speed, percent }: any) {
    this.updateWinow.webContents.send('update-download-progress', {
      transferred: byteConvert(transferred),
      total: byteConvert(total),
      speed: byteConvert(speed),
      percent
    });
  }

  /**
   * 更新下载
   */
  async updateDownload() {
    const files = dialog.showOpenDialogSync({
      defaultPath: global.downloadPath,
      properties: ['openDirectory'],
      title: '请选择保存路径'
    });

    if (files) {
      const saveDir = files[0];
      const savePath = path.join(saveDir, this.updateInfo.downloadFile);

      try {
        getInstallPackage(this.updateInfo.exeUrl)
          .on('progress', state => {
            this.sendWebContents({
              transferred: state.size.transferred,
              total: state.size.total,
              speed: state.speed,
              percent: Number(Math.round(state.percent * 100))
            });
          })
          .on('error', error => {
            throw new Error(error);
          })
          .on('end', async () => {
            this.sendWebContents({
              percent: 100
            });

            await shell.openExternal(savePath);

            global.forceQuit = true;
            app.quit();
          })
          .pipe(fs.createWriteStream(savePath));
      } catch (error) {
        throw new Error('网络异常，请重试');
      }
    }
  }

  /**
   * 获取最新版本信息
   * @returns
   */
  async getLatestVersionInfo(): Promise<GithubLatestVersion> {
    return await getLatestVersionInfo();
  }

  /**
   * 检查是否存在更新版本号
   * @returns
   */
  async checkLatestVersion(): Promise<{
    canUpdate: boolean;
    body: Array<string>;
    name: string;
    version: string;
    localVersion: string;
    exeUrl: string;
  }> {
    const latestVersion = await this.getLatestVersionInfo();

    const result = {
      canUpdate: compareVersion(latestVersion.tag_name, this.version),
      body: latestVersion.body,
      name: latestVersion.name,
      version: latestVersion.tag_name,
      localVersion: this.version,
      more: latestVersion.html_url,
      downloadFile: latestVersion.assets[0].name,
      exeUrl: latestVersion.assets[0].browser_download_url
    };

    this.updateInfo = result;

    if (result.canUpdate) {
      this.updateWinOpen();
    }

    return result;
  }
}

export default new UpdateService();
