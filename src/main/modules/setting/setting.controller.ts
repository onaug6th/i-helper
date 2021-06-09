import { ipcMain } from 'electron';
import settingService from './setting.service';

//  获取快捷键
ipcMain.handle('get-setting', () => {
  return settingService.settingData;
});
