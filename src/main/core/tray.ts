import { app, Menu, MenuItem, Tray } from 'electron';
import path from 'path';
import { windows } from '@/utils/browserWindow';

let tray = null;

const menus: Array<MenuItem> = [
  /* eslint-disable @typescript-eslint/ban-ts-comment */
  // @ts-ignore
  {
    role: 'quit',
    label: '退出'
  }
];

app.on('ready', () => {
  tray = new Tray(path.join(process.cwd(), 'public', 'favicon.ico'));
  const contextMenu = Menu.buildFromTemplate(menus);
  tray.setContextMenu(contextMenu);

  tray.on('click', () => {
    const win = windows.home;
    win.show();
  });
});
