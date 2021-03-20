import { ipcMain } from 'electron';
import * as settingService from './setting.service';

//  获取快捷键
ipcMain.handle('shortcut-get', () => {
  return settingService.getSetting('shortcut');
});

//  更新快捷键
ipcMain.on('shortcut-update', (event, result) => {
  const { type, shortcut } = result;
  type;
  shortcut;
});
