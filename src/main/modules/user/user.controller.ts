import { ipcMain } from 'electron';
import userService from './user.service';

//  检查最新版本
ipcMain.handle('user-register', (event, formData) => {
  return userService.register(formData);
});
