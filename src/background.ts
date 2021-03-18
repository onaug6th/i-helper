/* eslint-disable @typescript-eslint/no-empty-function */
'use strict';

import { app, protocol, BrowserWindow, session } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';
import { createHomeBrowserWindow } from '@/utils/browserWindow';
import './main/ipcEvent/index';
import './main/core/tray';

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
  win = createHomeBrowserWindow();

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
