import { ipcMain } from 'electron';
import shortcutKeyManage from './shortcutKey.controller';

//  更新快捷键
ipcMain.handle('shortcutKey-update', (event, result) => {
  const { type, key } = result;

  return shortcutKeyManage.shortcutKeyUpdate(type, key);
});
