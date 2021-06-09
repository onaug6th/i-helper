import { Menu, MenuItem, Tray } from 'electron';
import path from 'path';
import windowService from '@/main/modules/window/window.service';

let tray = null;

const menus: Array<MenuItem> = [
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  {
    role: 'quit',
    label: '退出'
  }
];

class TrayService {
  /**
   * 应用初始化时执行
   */
  appOnReady() {
    const trayPath = {
      dev: path.join(process.cwd(), 'public', 'favicon.ico'),
      prod: path.join(__dirname, 'favicon.ico')
    };
    tray = new Tray(global.isDev ? trayPath.dev : trayPath.prod);
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
