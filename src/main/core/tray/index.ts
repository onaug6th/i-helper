import { Menu, MenuItem, Tray } from 'electron';
import path from 'path';
import windowManage from '@/main/core/window/windowManage';
const isDevelopment = process.env.NODE_ENV !== 'production';

let tray = null;

const menus: Array<MenuItem> = [
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  {
    role: 'quit',
    label: '退出'
  }
];

class TrayManage {
  /**
   * 应用初始化时执行
   */
  appOnReady() {
    tray = new Tray(
      isDevelopment ? path.join(process.cwd(), 'public', 'favicon.ico') : path.join(__dirname, 'favicon.ico')
    );
    const contextMenu = Menu.buildFromTemplate(menus);
    tray.setContextMenu(contextMenu);
    tray.setToolTip('i-helper');
    tray.on('click', () => {
      const win = windowManage.mainWindow;
      win.show();
    });
  }
}

export default new TrayManage();
