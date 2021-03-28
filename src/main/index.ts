/**
 * 主进程初始化入口页面
 */
'use strict';

import { app, protocol, BrowserWindow, session } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
//  窗体管理
import windowManage from './core/window/windowManage';
//  设置管理
import settingManage from './core/setting/settingManage';
//  快捷键管理
import shortcutKeyManage from './core/shortcutKey/shortcutKeyManage';
//  托盘管理
import trayManage from './core/tray';
//  托盘管理
import miniAppManage from './core/miniApp/miniAppManage';
//  ipcMain
import './service/index';

const isDevelopment = process.env.NODE_ENV !== 'production';

let win: BrowserWindow | null;
protocol.registerSchemesAsPrivileged([
  {
    scheme: 'app',
    privileges: {
      secure: true,
      standard: true
    }
  }
]);

/**
 * 打开主界面
 */
function createWindow() {
  win = windowManage.createHomeBrowserWindow();

  if (!process.env.WEBPACK_DEV_SERVER_URL) {
    createProtocol('app');
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (win === null) {
    createWindow();
  }
});

app.on('ready', async () => {
  if (isDevelopment && !process.env.IS_TEST) {
    const path =
      'C:/Users/onaug6th/AppData/Local/Google/Chrome/User Data/Default/Extensions/ljjemllljcmogpfapbkkighbhhppjdbg/6.0.0.7_0';
    //  加载vue开发者工具
    await session.defaultSession.loadExtension(path);
  }

  createWindow();

  settingManage.appOnReady(app);
  shortcutKeyManage.appOnReady();
  trayManage.appOnReady();
  miniAppManage.appOnReady();
});

if (isDevelopment) {
  if (process.platform === 'win32') {
    process.on('message', data => {
      if (data === 'graceful-exit') {
        app.quit();
      }
    });
  } else {
    process.on('SIGTERM', () => {
      app.quit();
    });
  }
}
