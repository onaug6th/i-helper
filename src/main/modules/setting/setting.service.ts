import { ipcMain } from 'electron';
import settingManage from './setting.controller';

//  获取快捷键
ipcMain.handle('get-setting', () => {
  return settingManage.settingData;
});
