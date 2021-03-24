import { ipcMain } from 'electron';
import settingManage from '@/main/core/setting/settingManage';

//  获取快捷键
ipcMain.handle('get-setting', () => {
  return settingManage.settingData;
});
