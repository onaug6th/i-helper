import { app, Menu, MenuItem, Tray } from 'electron';
import windowService from '@/main/modules/window/window.service';
import updateService from '../update/update.service';

let tray = null;

const menus: Array<MenuItem> = [
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  {
    click() {
      updateService.checkLatestVersion();
    },
    label: '检查更新'
  },
  // @ts-ignore
  {
    click() {
      global.forceQuit = true;
      app.quit();
    },
    label: '退出'
  }
];

class TrayService {
  /**
   * 应用初始化时执行
   */
  appOnReady() {
    tray = new Tray(global.appTrayPath);

    const contextMenu = Menu.buildFromTemplate(menus);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('i-helper');
    tray.on('click', () => {
      const win = windowService.mainWindow;
      win.show();
    });
  }
}

export default new TrayService();
