import { getInstallPackage, getLatestVersionInfo } from '@/main/api';
import { browserWindowOptions } from '@/main/constants/config/browserWindow';
import { compareVersion } from '@/utils';
import { app, BrowserWindow, dialog } from 'electron';
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
    if (this.updateWinow) {
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
   * 更新下载
   */
  updateDownload() {
    const files = dialog.showOpenDialogSync({
      defaultPath: global.downloadPath,
      properties: ['openDirectory'],
      title: '请选择保存路径'
    });

    if (files) {
      getInstallPackage(this.updateInfo.exeUrl);
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
    updateList: Array<string>;
    name: string;
    version: string;
    localVersion: string;
    exeUrl: string;
  }> {
    const latestVersion = await this.getLatestVersionInfo();

    const result = {
      canUpdate: compareVersion(latestVersion.tag_name, this.version),
      updateList: latestVersion.body.split('.').filter(Boolean),
      name: latestVersion.name,
      version: latestVersion.tag_name,
      localVersion: this.version,
      more: latestVersion.html_url,
      exeUrl: latestVersion.assets[0].browser_download_url
    };

    this.updateInfo = result;

    // if (result.canUpdate) {
    this.updateWinOpen();
    // }

    return result;
  }
}

export default new UpdateService();
