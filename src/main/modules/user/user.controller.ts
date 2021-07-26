import { ipcMain } from 'electron';
import userService from './user.service';

//  获取用户信息
ipcMain.handle('user-get', () => {
  return userService.getUser();
});

//  用户注册
ipcMain.handle('user-register', (event, formData) => {
  return userService.register(formData);
});

//  用户登录
ipcMain.handle('user-login', (event, formData) => {
  return userService.login(formData);
});

//  用户退出
ipcMain.handle('user-quit', () => {
  return userService.quit();
});
