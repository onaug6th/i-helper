import { ipcMain } from 'electron';
import settingService from './setting.service';

//  获取设置
ipcMain.handle('setting-get', () => {
  return settingService.settingData;
});

//  设置更新
ipcMain.handle('setting-update', (event, data) => {
  const { type, val } = data;
  return settingService.update(type, val);
});
