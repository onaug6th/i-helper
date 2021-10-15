import { getInstallPackage, getReleases } from '@/main/api/plugin';
import { browserWindowOptions } from '@/main/constants/config/browserWindow';
import { byteConvert, compareVersion } from '@/utils';
import fs from 'fs';
import path from 'path';
import { app, BrowserWindow, shell } from 'electron';
import windowService from '../window/window.service';
import { docsURL, releasePageURL } from '@/main/constants/url';

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

  /**
   * 查看版本信息
   */
  openMore() {
    shell.openExternal(this.updateInfo.more);
  }

  /**
   * 访问官网
   */
  openHomePage() {
    shell.openExternal(docsURL);
  }

  /**
   * 往更新窗体发送消息
   * @param param0
   */
  sendWebContents({ transferred, total, speed, percent }: { [propName: string]: number }) {
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
      const savePath = path.join(global.downloadPath, this.updateInfo.packageName);

      getInstallPackage(this.updateInfo.packageUrl)
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
  async checkLatestVersion(
    openWin = true
  ): Promise<{
    canUpdate: boolean;
    body: string;
    name: string;
    version: string;
    localVersion: string;
    packageUrl: string;
  }> {
    //  获取最新版本信息
    const latestVersion = await getReleases();

    const extName = global.isWindows ? 'exe' : 'pkg';
    const releaseInfo = {
      packageName: '',
      packageUrl: '',
      tag_name: '',
      body: ''
    };

    for (let i = latestVersion.length; i--; i > 0) {
      const release = latestVersion[i];
      const matched = release.assets.some(asset => {
        const { name, browser_download_url } = asset;

        if (name && name.includes(extName)) {
          releaseInfo.packageName = name;
          releaseInfo.packageUrl = browser_download_url;
          releaseInfo.tag_name = release.tag_name;
          releaseInfo.body = release.body;
          return true;
        }
      });
      if (matched) {
        break;
      }
    }

    const result = {
      canUpdate: compareVersion(this.version, releaseInfo.tag_name),
      body: releaseInfo.body,
      name: releaseInfo.packageName,
      version: releaseInfo.tag_name,
      localVersion: this.version,
      more: releasePageURL,
      packageName: releaseInfo.packageName,
      packageUrl: releaseInfo.packageUrl
    };

    this.updateInfo = result;

    if (result.canUpdate && openWin) {
      this.updateWinOpen();
    }

    return result;
  }
}

export default new UpdateService();
