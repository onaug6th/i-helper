import { getInstallPackage, getLatestVersionInfo } from '@/main/api/plugin';
import { browserWindowOptions } from '@/main/constants/config/browserWindow';
import { byteConvert, compareVersion } from '@/utils';
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import windowService from '../window/window.service';

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
  updateDownload() {
    return new Promise((resolve, reject) => {
      const savePath = path.join(global.downloadPath, this.updateInfo.downloadFile);

      getInstallPackage(this.updateInfo.exeUrl)
        .on('progress', state => {
          this.sendWebContents({
            transferred: state.size.transferred,
            total: state.size.total,
            speed: state.speed,
            percent: Number(Math.round(state.percent * 100))
          });
        })
        .on('error', () => {
          reject('网络异常');
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
    });
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
    //  获取最新版本信息
    const latestVersion = await getLatestVersionInfo();

    const result = {
      canUpdate: compareVersion(this.version, latestVersion.tag_name),
      body: latestVersion.body,
      name: latestVersion.name,
      version: latestVersion.tag_name,
      localVersion: this.version,
      more: 'https://github.com/onaug6th/i-helper/releases',
      downloadFile: latestVersion.assets[0].name,
      exeUrl: latestVersion.assets[0].browser_download_url
    };

    this.updateInfo = result;

    this.updateWinOpen();

    return result;
  }
}

export default new UpdateService();
