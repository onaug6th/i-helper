import { ipcMain } from 'electron';
import updateService from './update.service';

//  检查最新版本
ipcMain.handle('update-check-release', () => {
  return updateService.checkLatestVersion();
});

//  获取更新信息
ipcMain.handle('update-get-release', () => {
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

//  打开更新信息页
ipcMain.handle('update-open-more', () => {
  updateService.openMore();
});

//  打开iHelper官网
ipcMain.handle('update-open-homePage', () => {
  updateService.openHomePage();
});
