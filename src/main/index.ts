/**
 * 主进程初始化入口页面
 */
'use strict';

import { app, protocol, BrowserWindow, session } from 'electron';
import { createProtocol } from 'vue-cli-plugin-electron-builder/lib';

//  窗体管理
import windowService from './modules/window/window.service';
import modules from './modules';

export default function launchApp(): void {
  const gotTheLock = app.requestSingleInstanceLock();
  if (!gotTheLock) {
    return app.quit();
  }

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
    win = windowService.createMainWin();

    win.on('close', e => {
      //  未指定强制退出，都一律隐藏
      if (!global.forceQuit) {
        e.preventDefault();
        win.hide();
      }
    });

    if (!process.env.WEBPACK_DEV_SERVER_URL) {
      createProtocol('app');
    }
  }

  app.on('window-all-closed', e => {
    if (global.forceQuit) {
      app.quit();
    } else {
      e.preventDefault();
    }
  });

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.on('second-instance', (event, commandLine, workingDirectory) => {
    const mainWindow = windowService.mainWindow;
    if (mainWindow) {
      if (mainWindow.isMinimized()) {
        mainWindow.restore();
      }
      mainWindow.focus();
      mainWindow.show();
    }
  });

  app.on('activate', () => {
    if (win === null) {
      createWindow();
    }
  });

  app.on('ready', async () => {
    // if (global.isDevMode && !process.env.IS_TEST) {
    //   const path =
    //     'C:/Users/onaug6th/AppData/Local/Google/Chrome/User Data/Default/Extensions/ljjemllljcmogpfapbkkighbhhppjdbg/6.0.0.8_0';

    //   try {
    //     //  加载vue开发者工具
    //     await session.defaultSession.loadExtension(path);
    //   } catch (error) {
    //     //  如果出错，需要将上面的地址换成本机谷歌开发者插件安装的目录地址
    //     console.info(error);
    //   }
    // }

    protocol.registerFileProtocol('atom', (request, callback) => {
      const url = request.url.substr(8);
      callback(decodeURI(url));
    });

    createWindow();

    modules.init(app);
  });

  if (global.isDevMode) {
    if (global.isWindows) {
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
}
