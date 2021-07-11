import { ipcMain } from 'electron';
import updateService from './update.service';

//  检查最新版本
ipcMain.handle('check-latest-version', () => {
  return updateService.checkLatestVersion();
});

//  获取更新信息
ipcMain.handle('get-update-info', () => {
  return updateService.updateInfo;
});

//  更新包下载
ipcMain.handle('update-download', () => {
  return updateService.updateDownload();
});

//  关闭更新窗体
ipcMain.handle('update-win-close', () => {
  updateService.updateWinClose();
});
